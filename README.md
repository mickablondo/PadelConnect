# PadelConnect

PadelConnect est une application décentralisée de gestion de tournois de Padel permettant de créer une communauté autour de ce sport en proposant notamment un réseau social décentralisé.  

## Description

### Rôles
| Rôle | Description |
|----|----|
| Owner | Le propriétaire est l'administrateur de l'application. |
| Manager | Un <i>manager</i> est celui qui gère ses tournois. |
| Player | Toute personne n'étant pas <i>manager</i> ni <i>owner</i> est un jouer. |

### Liens

- [ ] web site deployed : 
- [ ] contract url
- [ ] Board of issues
- [ ] Lien ipfs ou autre pour le NFT !?

### Stack technique

- [ ] Lister sous forme de badges les technos utilisées : React / Nextjs / Wagmi / Viem /Solidity / Git / Chakra-ui / Rainbow Kit / EtherJs (?) / Hardhat (?) / chai (?) / TU (?)

## Schéma des interactions
Le schéma ci-dessous montrent les interactions entre le frontend et les smart contracts :  
```mermaid
flowchart >
    A[ /home] -->|If owner| B[ /admin]
    A -->|If manager| C[ /manager]
    A -->|Any user| D[ /tournament] 
    D -->|Any user| E[ /inscription]
    D -->|Any user| F[ /forum]
    D -->|Any user| G[ /pm]
    B -.->|add manager| I((Smart Contract - Forum))
    C -.->|add tournament| I
    D -.->|get infos tournament| I
    E -.->|register player in tournament<br/>pay the manager| I
    E -.->|add winners| I
    F -.->|add comment| I
    G -.->|add private comment| I
    I -.->|mint for the winners| J((Smart Contract - NFT))
    I -.->|events tournaments/comments| A
```
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/2214d57d-b78b-4f01-93a0-ccec16eb74e1)


## Description des fonctionnalités

- [ ] Résumé des éléments fonctionnels du projet.

## Instructions d'installation

- [ ] Liste des commandes pour lancer le projet : Backend
- [ ] Liste des commandes pour lancer le projet : Frontend
- [ ] Commande pour lancer les TU + rapport à ajouter
- [ ] Scripts de migration
- [ ] Scripts personnels : ajout d'un manager et d'un tournoi / ajout de messages ...

### Backend
### Frontend
### Tests unitaires
