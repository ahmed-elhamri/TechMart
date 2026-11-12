# Automatisation des tests E2E avec Playwright, Jira Xray et GitLab CI/CD

> De l'analyse des besoins au reporting automatisé

**Application testée :** TechMart
**Réalisé par :** Ahmed ELHAMRI

![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)
![Jira Xray](https://img.shields.io/badge/Jira%20Xray-Test%20Management-0052CC?logo=jira&logoColor=white)
![GitLab CI/CD](https://img.shields.io/badge/GitLab-CI%2FCD-FC6D26?logo=gitlab&logoColor=white)

---

## Table des matières

- [Introduction](#introduction)
- [1. Présentation de l'application TechMart](#1-présentation-de-lapplication-techmart)
- [2. Analyse des besoins et User Stories dans Jira](#2-analyse-des-besoins-et-user-stories-dans-jira)
- [3. Rédaction et gestion des cas de test avec Xray](#3-rédaction-et-gestion-des-cas-de-test-avec-xray)
- [4. Automatisation des tests E2E avec Playwright](#4-automatisation-des-tests-e2e-avec-playwright)
- [5. Intégration continue avec GitLab CI/CD](#5-intégration-continue-avec-gitlab-cicd)
- [6. Reporting automatisé avec JUnit, XML et Xray](#6-reporting-automatisé-avec-junit-xml-et-xray)
- [7. Résultats, anomalies détectées et bilan](#7-résultats-anomalies-détectées-et-bilan)
- [Conclusion](#conclusion)

---

## Introduction

Ce projet présente l'automatisation des tests de l'application e-commerce **TechMart**. Il décrit les étapes suivies, depuis l'analyse des besoins jusqu'à l'exécution automatique des tests et la génération des rapports.

Ce projet est ma première expérience avec plusieurs outils de test :

- **Jira** : création et organisation des User Stories ;
- **Xray** : rédaction et suivi des cas de test ;
- **Playwright** : automatisation des parcours utilisateurs ;
- **GitLab CI/CD** : exécution automatique des tests et génération des rapports.

L'objectif est de créer un processus de test simple et organisé. Chaque besoin est lié à des cas de test. Les tests importants sont automatisés avec Playwright. Les résultats sont ensuite envoyés vers Xray grâce aux rapports JUnit au format XML.

---

## 1. Présentation de l'application TechMart

### 1.1 Présentation générale

TechMart est une application web de vente en ligne. Elle permet aux utilisateurs de consulter des produits technologiques et de réaliser un achat en ligne.

L'application contient un catalogue de **six produits**. Chaque produit possède un nom, un prix, une catégorie et une quantité disponible en stock.

TechMart permet aussi de créer un compte, de se connecter et de se déconnecter. Après la connexion, la session de l'utilisateur reste active même après l'actualisation de la page.

### 1.2 Origine de l'application

L'application TechMart **n'a pas été développée dans le cadre de ce projet**. Elle a été récupérée depuis GitHub et utilisée comme application de démonstration pour pratiquer les différentes étapes du test logiciel : analyse des besoins, création des User Stories, rédaction des cas de test, automatisation avec Playwright, intégration continue et reporting.

Le travail réalisé concerne donc principalement la stratégie de test, les cas de test créés dans Jira et Xray, l'automatisation des scénarios E2E et l'intégration avec GitLab CI/CD.

**Source de l'application :** [software-testing-course / sample-app](https://github.com/beaucarnes/software-testing-course/tree/main/sample-app)

<img width="1920" height="1956" alt="accueil-techmart" src="https://github.com/user-attachments/assets/365ee5cf-1b20-48b6-a6d4-e91400b5b6c3" />

*Figure 1.1 – Page d'accueil de l'application TechMart.*

### 1.3 Fonctionnalités principales

- consulter le catalogue des produits ;
- rechercher un produit avec un mot-clé ;
- filtrer les produits par catégorie ou par prix ;
- trier les produits par nom ou par prix ;
- ajouter un produit au panier ;
- modifier la quantité ou supprimer un produit du panier ;
- créer un compte et se connecter ;
- passer une commande avec des informations de livraison et de paiement ;
- vérifier le total, la taxe et la confirmation de commande ;
- mettre à jour le stock après une commande.

### 1.4 Parcours utilisateur principal

Le parcours principal commence par la consultation du catalogue. L'utilisateur peut rechercher un produit ou utiliser les filtres pour trouver un article.

Ensuite, il peut ajouter un ou plusieurs produits au panier. Dans le panier, il peut modifier la quantité, supprimer un article ou vérifier le montant total.

Enfin, il accède à la page de commande, complète les informations de livraison et de paiement. Après la validation, l'application affiche une confirmation de commande et met à jour le stock disponible.

<img width="1920" height="945" alt="panier-techmart" src="https://github.com/user-attachments/assets/579a4a31-3b2b-413d-bb2d-9ed1de3d88f7" />

*Figure 1.2 – Exemple du parcours d'achat dans TechMart.*

### 1.5 Technologies utilisées dans l'application

- **Interface** : HTML, CSS et JavaScript ;
- **Serveur** : Node.js et Express.

Le serveur gère les produits, les utilisateurs, les sessions, les paniers et les commandes. Les données sont stockées en mémoire, ce qui est adapté à un projet de formation car cela permet de tester l'application dans un environnement simple et contrôlé.

---

## 2. Analyse des besoins et User Stories dans Jira

### 2.1 Analyse des besoins

L'analyse des besoins a été réalisée à partir des principales fonctions de TechMart. Les besoins identifiés concernent principalement :

- la consultation et la recherche de produits ;
- le filtrage et le tri du catalogue ;
- la gestion du panier ;
- la création de compte et la connexion ;
- la validation d'une commande ;
- la mise à jour du stock après un achat.

Cette analyse permet de définir clairement ce qui doit être vérifié pendant les tests et d'éviter d'oublier des fonctions importantes.

### 2.2 Présentation de Jira

Jira est un outil de gestion de projet. Il permet de créer, organiser et suivre les besoins d'un projet. Dans ce projet, il a été utilisé pour créer les User Stories. Chaque User Story contient un titre, une description et des critères d'acceptation.

Jira facilite l'organisation des besoins et assure une bonne **traçabilité** entre les besoins, les tests et les résultats.

<img width="1920" height="945" alt="jira-backlog" src="https://github.com/user-attachments/assets/66830e0a-2bfc-42a4-9b90-b9cc94c9d4fb" />

*Figure 2.1 – Backlog du projet dans Jira.*

### 2.3 Création des User Stories

Les User Stories suivent la forme :

> *En tant que [utilisateur], je veux [action] afin de [objectif].*

Exemple : *En tant que client, je veux ajouter un produit au panier afin de pouvoir passer une commande.*

| Fonction | Exemple de User Story |
|---|---|
| Catalogue | En tant que client, je veux rechercher un produit afin de le trouver rapidement. |
| Panier | En tant que client, je veux modifier la quantité d'un article afin d'adapter ma commande. |
| Authentification | En tant qu'utilisateur, je veux me connecter afin d'accéder à mon compte. |
| Commande | En tant que client, je veux valider ma commande afin de terminer mon achat. |

*Tableau 2.1 – Exemples de User Stories créées pour TechMart.*

### 2.4 Critères d'acceptation

Pour chaque User Story, des critères d'acceptation ont été définis afin de préciser le résultat attendu. Par exemple, pour la User Story sur le panier :

- l'utilisateur peut ajouter un produit au panier ;
- le nombre d'articles dans le panier est mis à jour ;
- le sous-total est calculé correctement ;
- l'utilisateur peut modifier la quantité d'un article ;
- l'utilisateur peut supprimer un article du panier.

Ces critères sont utilisés pour créer les cas de test dans Xray.

<img width="1920" height="945" alt="jira-user-story" src="https://github.com/user-attachments/assets/265aae2a-8cc5-4d43-b967-5329438c4596" />

*Figure 2.2 – Exemple d'une User Story et de ses critères d'acceptation dans Jira.*

---

## 3. Rédaction et gestion des cas de test avec Xray

### 3.1 Présentation de Xray

Xray est une extension de Jira dédiée à la gestion des tests. Il permet de créer des cas de test manuels et automatisés, de les organiser dans des plans de test et de suivre leurs résultats. Les besoins, les tests et les anomalies restent dans le même environnement.

Dans ce projet, Xray a été utilisé pour :

- créer les cas de test ;
- définir les étapes à suivre ;
- ajouter les résultats attendus ;
- définir la priorité des tests ;
- organiser les tests dans un **Test Plan** ;
- exécuter les tests dans une **Test Execution** ;
- suivre les résultats `PASS`, `FAIL` ou `TODO`.

### 3.2 Rédaction des cas de test

Chaque cas de test a été créé à partir d'une User Story et de ses critères d'acceptation. Un cas de test contient généralement :

- un identifiant de test ;
- un titre clair ;
- une description ;
- des préconditions ;
- des étapes de test ;
- les résultats attendus ;
- une priorité.

<img width="1920" height="1652" alt="xray-test-case" src="https://github.com/user-attachments/assets/ab8e28fc-267c-47b8-91a6-69d10bb88645" />

*Figure 3.1 – Exemple d'un cas de test créé dans Xray.*

Exemple pour vérifier l'ajout d'un produit au panier :

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir la page d'accueil. | Le catalogue est affiché. |
| 2 | Cliquer sur le bouton d'ajout d'un produit. | Le produit est ajouté au panier. |
| 3 | Ouvrir le panier. | Le produit et son prix sont affichés. |

*Tableau 3.1 – Exemple d'étapes pour un cas de test panier.*

### 3.3 Organisation des cas de test

Les cas de test sont organisés selon les principales fonctions de TechMart :

- tests **Smoke** ;
- tests **Catalogue** ;
- tests **Panier** ;
- tests **Authentification** ;
- tests **Checkout**.

Les tests Smoke vérifient les fonctions principales de l'application. Les autres groupes couvrent les fonctions plus détaillées.

<img width="1920" height="1240" alt="xray-test-plan" src="https://github.com/user-attachments/assets/ae916eb9-28d5-4733-9c05-477ee83daee5" />

*Figure 3.2 – Organisation des cas de test dans un Test Plan Xray.*

### 3.4 Exécution des tests et suivi des résultats

Une **Test Execution** représente une session d'exécution des cas de test. Chaque test reçoit un statut :

| Statut | Signification |
|---|---|
| **PASS** | Le résultat obtenu correspond au résultat attendu. |
| **FAIL** | Le résultat obtenu est différent du résultat attendu. |
| **TODO** | Le test n'a pas encore été exécuté. |
| **EXECUTING** | Le test est en cours d'exécution. |

En cas d'échec, une anomalie peut être créée dans Jira et liée au cas de test.

<img width="1920" height="1470" alt="xray-test-execution" src="https://github.com/user-attachments/assets/48e857e9-4bd0-48c1-b7c7-8b214139519b" />
*Figure 3.3 – Résultats de l'exécution manuelle des tests E2E dans Xray.*

---

## 4. Automatisation des tests E2E avec Playwright

### 4.1 Présentation de Playwright

Playwright est un outil d'automatisation des tests web. Il simule les actions d'un utilisateur dans un navigateur (ouvrir une page, cliquer, remplir un formulaire, vérifier un message).

Il a été choisi car :

- il permet de tester une application web de bout en bout ;
- il est compatible avec plusieurs navigateurs ;
- il permet d'écrire les tests en JavaScript ;
- il génère des rapports de test ;
- il peut être utilisé dans un pipeline GitLab CI/CD.

### 4.2 Organisation du projet

- `tests/` : scénarios de test ;
- `pages/` : Page Objects ;
- `data/` : données utilisées pendant les tests ;
- `scripts/` : scripts PowerShell de préparation et d'import Xray.

<img width="2752" height="1342" alt="playwright-project-structure" src="https://github.com/user-attachments/assets/c4b32f71-ab5e-4ab7-90c9-5e420db4ea79" />

*Figure 4.1 – Organisation du projet d'automatisation Playwright.*

### 4.3 Utilisation du Page Object Model

Le projet utilise le **Page Object Model (POM)**, qui sépare les actions réalisées sur les pages des scénarios de test. Chaque page importante possède son propre fichier :

- `CatalogPage.js` : catalogue ;
- `LoginPage.js` : connexion ;
- `RegisterPage.js` : inscription ;
- `CartPage.js` : panier ;
- `CheckoutPage.js` : commande.

Cette structure évite de répéter les mêmes actions dans plusieurs fichiers de test.

### 4.4 Suites de tests automatisés

| Suite | Objectif |
|---|---|
| **Smoke** | Vérifie que les pages principales sont accessibles. |
| **Catalogue** | Vérifie la recherche, les filtres et le tri des produits. |
| **Panier** | Vérifie l'ajout, la modification et la suppression des articles. |
| **Authentification** | Vérifie l'inscription, la connexion et la déconnexion. |
| **Checkout** | Vérifie la commande, le paiement, la taxe et le stock. |

Au total, le projet contient **48 tests E2E automatisés**.

**Exemple d'un test automatisé avec Playwright :** [TechMart/tests/TS-SMOKE.spec.js](https://github.com/ahmed-elhamri/TechMart/blob/main/tests/TS-SMOKE.spec.js)

### 4.5 Exécution locale des tests

```bash
npx playwright test
```

À la fin de l'exécution, Playwright affiche le nombre de tests réussis et échoués, et génère un rapport HTML détaillé.

<img width="1920" height="1606" alt="playwright-local-result" src="https://github.com/user-attachments/assets/cd882daa-abd3-4e17-9123-2f07191a2a90" />

*Figure 4.3 – Résultat d'une exécution locale des tests Playwright.*

---

## 5. Intégration continue avec GitLab CI/CD

### 5.1 Présentation

GitLab CI/CD est intégré à GitLab et permet d'automatiser des tâches du projet. Dans ce projet, il permet de :

- installer les dépendances du projet ;
- installer le navigateur utilisé par Playwright ;
- lancer les tests automatisés ;
- générer les rapports de test ;
- conserver les fichiers générés comme artefacts ;
- publier le rapport HTML Playwright avec GitLab Pages.

Certains pipelines sont en statut **Failed**. Cet échec est **volontaire** : des cas de test ont été configurés pour échouer afin de vérifier que le pipeline détecte les tests en échec et génère les rapports correspondants. Même si le stage des tests échoue, les étapes de reporting continuent (`when: always`).

<img width="1920" height="1068" alt="gitlab-pipelines" src="https://github.com/user-attachments/assets/0fa25be7-dfa2-4d24-bb2e-692a0249795c" />

*Figure 5.1 – Pipelines GitLab : les échecs volontaires permettent de vérifier le reporting des tests échoués.*

### 5.2 Configuration du pipeline

Le pipeline est défini dans `.gitlab-ci.yml` et comporte trois stages : `test`, `xray` et `deploy`.

```bash
npm ci                          # installation des dépendances
npx playwright install chromium # installation du navigateur
npx playwright test             # exécution des tests
```

**Fichier de configuration .gitlab-ci.yml :** [TechMart/.gitlab-ci.yml](https://github.com/ahmed-elhamri/TechMart/blob/main/.gitlab-ci.yml)

### 5.3 Exécution des tests dans le pipeline

Le runner GitLab prépare l'environnement, télécharge les dépendances et lance les tests Playwright. À la fin, le statut du pipeline indique si les tests ont réussi ou échoué. Cela permet de vérifier rapidement que les fonctionnalités de TechMart continuent de fonctionner après une modification.

<img width="1920" height="1044" alt="gitlab-pipeline-success" src="https://github.com/user-attachments/assets/dad57c4c-b54a-43f6-acc0-0064cac195bf" />

*Figure 5.3 – Pipeline GitLab réussi : exécution des tests Playwright, import des résultats dans Xray et publication du rapport HTML.*

### 5.4 Gestion des artefacts

Les principaux artefacts générés sont :

- le rapport JUnit au format XML ;
- le rapport Playwright au format HTML ;
- le fichier XML préparé pour Xray ;
- les résultats et les traces des tests en cas d'échec.

---

## 6. Reporting automatisé avec JUnit, XML et Xray

### 6.1 Génération du rapport JUnit

JUnit est un format de rapport utilisé par de nombreux outils de test. Après l'exécution des tests Playwright, un fichier `junit-results.xml` est généré. Ce format est simple, connu et compatible avec GitLab CI/CD et Xray.

**Exemple du rapport JUnit généré après l'exécution des tests Playwright :** [TechMart/junit-results.xml](https://github.com/ahmed-elhamri/TechMart/blob/main/junit-results.xml)

### 6.2 Préparation du fichier XML pour Xray

Le rapport JUnit ne contient pas directement les informations nécessaires pour associer chaque résultat à un cas de test Xray. Le script PowerShell `prepare-xray-results.ps1` récupère les clés Jira présentes dans les noms des tests (par exemple `TEC-14`) et les ajoute dans le XML avec la propriété `test_key`. Le fichier généré est `xray-junit-results.xml`.

**Fichier XML préparé avec les clés des tests Xray :** [TechMart/xray-junit-results.xml](https://github.com/ahmed-elhamri/TechMart/blob/main/xray-junit-results.xml)

### 6.3 Import automatique des résultats dans Xray

Le script `import-xray-results.ps1` envoie les résultats vers **Xray Cloud** via l'API Xray : il crée une Test Execution et importe les résultats. Chaque cas de test reçoit son statut :

- `PASSED` si le test a réussi ;
- `FAILED` si le test a échoué ;
- `TODO` si le test n'a pas été exécuté.

Les résultats automatisés sont visibles dans Jira, avec les mêmes cas de test que ceux créés pendant la phase de test manuel.

<img width="1920" height="1584" alt="xray-automated-execution" src="https://github.com/user-attachments/assets/c2592b41-9322-4f1e-a39a-4cb324ed8207" />

*Figure 6.3 – Résultats des tests automatisés importés dans une Test Execution Xray.*

### 6.4 Publication du rapport HTML

Le rapport HTML Playwright est publié avec **GitLab Pages** après l'exécution du pipeline. Il affiche les suites de test, les scénarios réussis ou échoués et des informations utiles pour analyser un échec.

<img width="1532" height="645" alt="playwright-html-report" src="https://github.com/user-attachments/assets/d10621fd-f046-467b-93be-8df3e69df482" />

*Figure 6.4 – Rapport HTML Playwright publié avec GitLab Pages.*

---

## 7. Résultats, anomalies détectées et bilan

### 7.1 Résultats des tests

Lors d'une exécution manuelle, **48 cas de test** ont été exécutés : **46 ont réussi** et **2 ont échoué**. Ces échecs ont permis d'identifier des problèmes liés à la gestion du stock.

<img width="1920" height="1470" alt="xray-test-execution" src="https://github.com/user-attachments/assets/d3253b1b-569e-43b7-aae7-c92967606f47" />

*Figure 7.1 – Résultats d'une exécution manuelle des 48 cas de test dans Xray.*

### 7.2 Anomalies détectées

Les tests ont permis d'identifier deux anomalies fonctionnelles liées au stock :

1. **Panier** : l'application accepte une quantité supérieure au stock disponible, alors que le système devrait empêcher l'utilisateur d'ajouter plus de produits que la quantité disponible.
2. **Validation de commande** : l'application accepte une commande même lorsque la quantité demandée dépasse le stock disponible. Le système devrait refuser la commande et afficher un message d'erreur.

Ces anomalies ont été créées sous forme de tickets dans Jira et liées aux cas de test concernés pour garder une trace entre le problème détecté et le scénario de test.

<img width="1920" height="458" alt="jira-bugs" src="https://github.com/user-attachments/assets/3f681666-fc7a-42b7-99da-a3cf8df4029f" />

*Figure 7.2 – Anomalies créées dans Jira à partir des tests en échec.*

### 7.3 Apports du projet

Ce projet m'a permis de découvrir un processus complet de test logiciel :

- analyser les besoins et créer des User Stories dans Jira ;
- rédiger des cas de test, les exécuter dans Xray et suivre leurs résultats ;
- simuler les actions d'un utilisateur avec Playwright ;
- mieux organiser le code des tests grâce au Page Object Model ;
- lancer les tests automatiquement et générer les rapports avec GitLab CI/CD ;
- relier les tests automatisés au suivi qualité dans Jira.

### 7.4 Améliorations possibles

- corriger les anomalies liées à la gestion du stock ;
- ajouter de nouveaux cas de test ;
- exécuter les tests sur plusieurs navigateurs ;
- ajouter des tests de performance et de sécurité ;
- améliorer le reporting et les tableaux de suivi.

---

## Conclusion

Ce projet a permis de mettre en place un processus complet d'automatisation des tests pour l'application e-commerce TechMart : analyse des besoins et User Stories dans Jira, cas de test dans Xray, automatisation des parcours avec Playwright (Page Object Model), exécution automatique avec GitLab CI/CD, puis import des résultats JUnit/XML dans Xray et publication du rapport HTML avec GitLab Pages.

Les tests ont également permis d'identifier des anomalies liées à la gestion du stock dans TechMart. Le projet peut être amélioré en corrigeant ces anomalies, en ajoutant de nouveaux scénarios et en exécutant les tests sur plusieurs navigateurs.
