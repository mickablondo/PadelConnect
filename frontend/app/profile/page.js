import { useAccount } from 'wagmi'

const Profil = () => {
    const { isConnected, address } = useAccount();

    return (
        <div>Profil</div>
    )
}

export default Profil