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
- [ ] Section NFT
- [ ] Liste des commandes pour lancer le projet : Frontend
- [X] Commande pour lancer les TU + rapport à ajouter
- [ ] Scripts de migration
- [ ] Scripts personnels : ajout d'un manager et d'un tournoi / ajout de messages ...

### Backend
### Frontend
### Tests unitaires
Exécuter un noeud Hardhat : 
```bash
npx hardhat node
```
Puis il faut soit exécuter les tests seuls soit les tests avec la couverture :  
```bash
npx hardhat test  
npx hardhat coverage
```

Résultat :  
```bash
  Test PadelConnect
    Initialization
      ✔ should deploy the smart contract
    Adding managers
      ✔ should add a new manager
      ✔ should revert when caller is not the owner
      ✔ should revert when the manager address is the zero address
      ✔ should revert when the first name is empty
      ✔ should revert when the last name is empty
      ✔ should revert when the address was ever registered
    Adding tournaments
      ✔ should add a new tournament
      ✔ should revert when caller is not a manager
      ✔ should revert when the city is empty
      ✔ should revert when the date is in the past
      ✔ should revert when the number of players is odd
      ✔ should return the informations of a tournament with a difficulty p500
      ✔ should return the difficulty p25
      ✔ should return the difficulty p100
      ✔ should return the difficulty p250
      ✔ should return the difficulty p1000
      ✔ should return the difficulty p2000
      ✔ should revert if the difficulty is unknown
    After registrering players
      Followers
        ✔ should adding a follower to a tournament
        ✔ should revert if id does not exist
      Adding winners
        ✔ should add the winners
        ✔ should revert when caller is not the owner
        ✔ should revert if the two winners are the same person
        ✔ should add the winners
        ✔ should add the winners
        ✔ should add the winners
      Forum
        ✔ should add a new commment
        ✔ should revert if id does not exist
        ✔ should revert when player send many messages in a short time
        ✔ should revert if message is empty
      Private messages from a player
        ✔ should add a new private commment
        ✔ should revert if id does not exist
        ✔ should revert when player send many messages in a short time
        ✔ should revert if message is empty
      Response to the private messages by the manager
        ✔ should add a new private response
        ✔ should revert when caller is not a manager
        ✔ should revert if id does not exist
        ✔ should revert when player send many messages in a short time
        ✔ should revert if message is empty
        ✔ should revert when player address is the zero address
    Registering players
      ✔ should add a new player
      ✔ should revert if the id does not exist
      ✔ should revert when the first name is empty
      ✔ should revert when the last name is empty
      ✔ should revert when the tournament is complete
      ✔ should revert when tournament is already started


  47 passing (2s)

----------------------|----------|----------|----------|----------|----------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
 contracts/           |      100 |      100 |      100 |      100 |                |
  IPadelConnect.sol   |      100 |      100 |      100 |      100 |                |
  PadelConnect.sol    |      100 |      100 |      100 |      100 |                |
  PadelConnectNFT.sol |      100 |      100 |      100 |      100 |                |
----------------------|----------|----------|----------|----------|----------------|
All files             |      100 |      100 |      100 |      100 |                |
----------------------|----------|----------|----------|----------|----------------|
```

En version web via le fichier <i>./coverage/index.html</i> :  
  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/43f9a92e-0d84-4969-8b00-6d874ce8b0be)
  
  
> **Note**  
> Ajout de la librairie <i>@nomicfoundation/hardhat-network-helpers</i> pour manipuler la date de la blockchain.


```js
it('should revert when tournament is already started', async function() {
    await time.increaseTo(2087697299);
    await expectRevert(
        pcContract.connect(player1).registerPlayer(0, 'roger', 'federer'),
        "RegistrationEnded"
    );
});
```
