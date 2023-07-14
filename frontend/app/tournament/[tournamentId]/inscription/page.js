"use client"
import { useParams } from 'next/navigation'

const Inscription = () => {
    const params = useParams();

    return (
        <div>Veuillez vous inscrire au tournoi numéro {params.tournamentId}</div>
    )
}

export default Inscription