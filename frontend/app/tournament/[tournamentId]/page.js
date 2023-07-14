"use client"
import { useParams } from 'next/navigation'

/**
 * Fiche tournoi
 */
const Tournament = () => {
    const params = useParams();

    return (
    <div>Tournoi numéro {params.tournamentId}</div>
    )
}

export default Tournament