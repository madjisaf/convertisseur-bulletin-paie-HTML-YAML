Conversion du Memento paie vers des tests OpenFisca (format YAML).

Exécution
---------

- Installer [Node](https://nodejs.org).
- Cloner ou télécharger ce dépôt et `cd paie-memento-parser`.
- Installer les dépendances : `npm install`.
- Pour lancer la conversion : `npm start`.


Compléter le mapping
--------------------

Lors de la conversion, les noms utilisés dans le Memento doivent être convertis en noms de variables OpenFisca.
Le parser annoncera les noms non convertibles à l'exécution, qui doivent être complétés dans `assets/openfiscaMap.yaml`.
Le fonctionnement est donc de lancer la conversion, compléter le mapping, et itérer.
