# PadelConnect

![image](https://github.com/mickablondo/PadelConnect/assets/36310658/574ad835-ce6a-4435-b521-45b413e6379b)  
PadelConnect est une application décentralisée de gestion de tournois de Padel permettant de créer une communauté autour de ce sport en proposant notamment un réseau social décentralisé.  

## Description

### Liens

- Maquettes réalisées sur [Balsamiq.cloud](https://balsamiq.cloud/somhp53/p5sdeh6)
- Url de la dApp déployée (connecté au contrat déployé sur Goerli) : https://padel-connect.vercel.app/
- Adresse du contrat sur Goerli : [0x4aCB6c67D15E3251299614832E6bA94B98a0Dd80](https://goerli.etherscan.io/address/0x4aCB6c67D15E3251299614832E6bA94B98a0Dd80)
- Le contrat a également été déployé sur Sepolia : [0x5b3e6a0027439Ab1F439A41B22DF2AB26Bc82719](https://sepolia.etherscan.io/address/0x5b3e6a0027439Ab1F439A41B22DF2AB26Bc82719)
- Tableau de bord des issues : https://github.com/mickablondo/PadelConnect/issues?q=is%3Aissue
- Vidéo de la démo : https://www.loom.com/share/dcfe31b075fc4e6199a22d67366e3aac?t=280&sid=374a89aa-38a9-4378-a7e5-9610f21f630a

### Stack technique
Solidity / Hardhat / React / Nextjs / Wagmi / Viem / Rainbow Kit / Chakra-ui / Ethers.js / chai.js

### Rôles
| Rôle | Description |
|----|----|
| Owner | Le propriétaire est l'administrateur de l'application. |
| Manager | Un <i>manager</i> est celui qui gère ses tournois. |
| Player | Toute personne n'étant pas <i>manager</i> ni <i>owner</i> est un joueur. |  

### Fonctionnalités
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/7b800ee3-06ff-4a29-870e-0b17e185fbb3)


## Schéma des interactions
Le schéma ci-dessous montrent les interactions entre le frontend et le smart contract :  
```mermaid
flowchart >
    A[ /home] -->|If owner| B[ /admin]
    A -->|If manager| C[ /tournament/add]
    A -->|Any user| D[ /tournament/id]
    A -->|If manager| H[ /messageboard]
    A -->|Any user| F[ /profile]
    D -->|Any user| G[ /ask/address]
    B -.->|add manager| I((Smart Contract))
    C -.->|add tournament| I
    D -.->|get info tournament| I
    D -.->|register in tournament| I
    D -.->|add winners| I
    D -.->|add comment| I
    D -.->|follow| I
    F -.->|get tournaments by player| I
    G -.->|add comment to manager| I
    G -.->|add response to player| I
    H -.->|find messages| I
    I -.->|event tournaments| A
    I -.->|event managers| B
    I -.->|event followed tournaments| F
```
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/2214d57d-b78b-4f01-93a0-ccec16eb74e1)

## Instructions d'installation

### Backend
Se baser sur le fichier <i>.env.example</i> pour configurer la partie backend.  
  
Pour ajouter les dépendances :  
```sh
npm install
```

Pour déployer le smart contract en local :  
```sh
npx hardhat node  
npx hardhat run scripts/deploy.js --network localhost
```  
  
Pour déployer sur un testnet comme Sepolia :  
```sh
npx hardhat run scripts/deploy.js --network sepolia
```
  
Pour déployer sur un testnet comme Goerli :  
```sh
npx hardhat run scripts/deploy.js --network goerli
```

### Frontend
Se baser sur le fichier <i>.env.example</i> pour configurer la partie frontend.  
  
Pour ajouter les dépendances :  
```sh
npm install
```  
  
Pour démarrer la partie frontend en local :  
```sh
npx next dev
```  

### Jeux de données 
3 scripts ont été créés dans scripts/datas permettant l'insertion de jeux de données :  
 - add_datas.js : ajoute un manager, plusieurs tournois et un commentaire ;
 - add_messages_to_manager.js : crée 3 messages entre un joueur et un manager (pré-requis : add_datas.js);
 - add_newtournament.js : ajoute un nouveau tournoi (pré-requis : add_datas.js);
 - register_player.js : enregistre 2 joueurs sur un tournoi et crée 2 commentaires sur ce même tournoi (pré-requis : add_datas.js / <b>Attention, vous n'avez que 30s pour exécuter ce script après le pré-requis !</b>);
  
Pour les exécuter :  
```bash
npx hardhat run scripts/datas/add_datas.js --network localhost
npx hardhat run scripts/datas/add_messages_to_manager.js --network localhost
npx hardhat run scripts/datas/add_newtournament.js --network localhost
npx hardhat run scripts/datas/register_player.js --network localhost
```

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
      ✔ should revert when the address was ever registered
    Adding tournaments
      ✔ should add a new tournament
      ✔ should emit an event when adding a new tournament
      ✔ should revert when caller is not a manager
      ✔ should revert when caller to get the tournaments is not a manager
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
        ✔ should emit an event when adding a follower to a tournament
        ✔ should deleting a follower to a tournament
        ✔ should revert if id does not exist
      Adding winners
        ✔ should add the winners
        ✔ should revert when caller is not the good manager
        ✔ should revert if the two winners are the same person
        ✔ should revert if id does not exist
        ✔ should revert if winner1 is the 0 address
        ✔ should revert if winner2 is the 0 address
        ✔ should revert if a winner has been not registered
      Forum
        ✔ should add a new commment
        ✔ should revert if id does not exist
        ✔ should revert when player send many messages in a short time
        ✔ should revert if message is empty
      Messages from a player to a manager
        ✔ should add a new message to a manager
        ✔ should not modify the exchanges array when adding two new messages to a manager (3028ms)
        ✔ should revert if id does not exist
        ✔ should revert when player send many messages in a short time
        ✔ should revert if message is empty
      Response to the messages by the manager
        ✔ should add a new response
        ✔ should revert when caller is not a manager
        ✔ should revert if id does not exist
        ✔ should revert when player send many messages in a short time
        ✔ should revert if message is empty
        ✔ should revert when player address is the zero address
        ✔ should revert if id does not exist when getting messages
        ✔ should revert when player address is the zero address when getting messages
    Registering players
      ✔ should decrease the number of registrations allowed when adding a new player
      ✔ should add a new tournament for the player registered
      ✔ should revert if the id does not exist
      ✔ should revert when the player is already registered
      ✔ should revert when the tournament is complete
      ✔ should revert when tournament is already started


  53 passing (5s)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |      100 |      100 |      100 |      100 |                |
  IPadelConnect.sol |      100 |      100 |      100 |      100 |                |
  PadelConnect.sol  |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
```

En version web via le fichier <i>./coverage/contracts/index.html</i> :  
  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/5e6ecd0b-828e-4323-877d-ca8acf726039)

  
> **Note**  
> Ajout de la librairie <i>@nomicfoundation/hardhat-network-helpers</i> pour manipuler la date de la blockchain.


```js
it('should revert when tournament is already started', async function() {
    await time.increaseTo(2087697299); // 27/02/2036
    await expectRevert(
        pcContract.connect(player1).registerPlayer(0),
        "RegistrationEnded"
    );
});
```

> **Note**  
> Ajout de la librairie <i>timers/promises</i> pour forcer un temps d'attente entre 2 messages envoyés.

```sh
✔ should not modify the exchanges array when adding two new messages to a manager (3025ms)
```

## Améliorations
- Ne pas signer à chaque message ajouté dans les chats ;
- Front-end à revoir ;
- Voir les [issues restantes](https://github.com/mickablondo/PadelConnect/issues) (améliorations / évolutions) ;

## Quelques écrans au 17/08/2023

![image](https://github.com/mickablondo/PadelConnect/assets/36310658/08d333b4-fa7f-49dd-8e63-1af2cf24934c)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/83a0d287-d0dc-453b-8044-00ed41b63aa0)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/e5e53408-ff8a-401b-a9e0-a47c04542f22)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/86d1c7f3-053e-416a-8745-de39903fae41)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/9c5d4f70-ae6c-4948-90b9-30dca87cc379)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/30abdaab-1ecd-4088-bf03-e9b025081e25)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/18cf0051-befe-498b-93e0-101049765b18)  
![image](https://github.com/mickablondo/PadelConnect/assets/36310658/496dd31a-fa91-4509-9993-379c4d69b600)







