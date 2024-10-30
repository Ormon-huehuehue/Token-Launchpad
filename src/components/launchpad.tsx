import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ExtensionType, MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, createInitializeMetadataPointerInstruction, createMint, getMinimumBalanceForRentExemptMint, getMintLen, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, LENGTH_SIZE, getAssociatedTokenAddress, getAssociatedTokenAddressSync, createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createMintToInstruction  } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function TokenLaunchpad() {

    const {connection} = useConnection();
    const wallet = useWallet();


    const createToken = async ()=>{

        const mintKeypair = Keypair.generate();
        
        const metadata = {
            mint : mintKeypair.publicKey,
            name : "Ormon",
            symbol : "ORMN",
            uri : "https://cdn.100xdevs.com/metadata.json",
            additionalMetadata : []
        }
        
        
        const mintLen = getMintLen([ExtensionType.MetadataPointer])
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey : wallet.publicKey as PublicKey,
                newAccountPubkey : mintKeypair.publicKey,
                space : MINT_SIZE,
                lamports,   
                programId : TOKEN_PROGRAM_ID
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey as PublicKey, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey as PublicKey,
                updateAuthority: wallet.publicKey as PublicKey,
            }),
        )
        

        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection);
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey as PublicKey,
            false,
            TOKEN_2022_PROGRAM_ID
        )

        console.log(associatedToken.toBase58());

        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey as PublicKey,
                associatedToken,
                wallet.publicKey as PublicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
        );

        await wallet.sendTransaction(transaction2, connection);

        const transaction3 = new Transaction().add(
            createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey as PublicKey, 1000000000, [], TOKEN_2022_PROGRAM_ID)
        );

        await wallet.sendTransaction(transaction3, connection);

        console.log("Minted!")

    }

    return  (
    <div className = "100vh flex flex-col justify-center items-center gap-2 ">
        <h1>Solana Token Launchpad</h1>
        <input className='bg-black w-[200px] h-[30px] text-start px-5 py-3 text-sm' type='text' placeholder='Name'></input> <br />
        <input className='bg-black w-[200px] h-[30px] text-start px-5 py-3 text-sm' type='text' placeholder='Symbol'></input> <br />
        <input className='bg-black w-[200px] h-[30px] text-start px-5 py-3 text-sm' type='text' placeholder='Image URL'></input> <br />
        <input className='bg-black w-[200px] h-[30px] text-start px-5 py-3 text-sm' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick = {createToken} className='bg-green-500 px-5 py-2 rounded-md'>Create a token</button>
    </div>
    )
}