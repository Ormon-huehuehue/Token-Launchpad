


export function TokenLaunchpad() {
    return  (
    <div className = "100vh flex flex-col justify-center items-center gap-2 ">
        <h1>Solana Token Launchpad</h1>
        <input className='bg-black' type='text' placeholder='Name'></input> <br />
        <input className='bg-black' type='text' placeholder='Symbol'></input> <br />
        <input className='bg-black' type='text' placeholder='Image URL'></input> <br />
        <input className='bg-black' type='text' placeholder='Initial Supply'></input> <br />
        <button className='btn'>Create a token</button>
    </div>
    )
}