const fs = require('fs').promises;
const path = require('path');

// Fonction pour lire le fichier JSON des utilisateurs
const getUsersFromJson = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la lecture du fichier JSON des utilisateurs.');
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await getUsersFromJson();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};

// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await getUsersFromJson();
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
};

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const users = await getUsersFromJson();
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
    };

    users.push(newUser);
    // Mettez à jour le fichier JSON avec le nouvel utilisateur
    await fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2), 'utf8');

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
  }
};

// Mettre à jour un utilisateur par ID
const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await getUsersFromJson();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      // Mettez à jour les données de l'utilisateur
      users[userIndex].name = req.body.name || users[userIndex].name;
      users[userIndex].email = req.body.email || users[userIndex].email;

      // Mettez à jour le fichier JSON avec les modifications
      await fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2), 'utf8');

      res.json(users[userIndex]);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
  }
};

// Supprimer un utilisateur par ID
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await getUsersFromJson();
    const filteredUsers = users.filter((u) => u.id !== userId);

    if (users.length !== filteredUsers.length) {
      // Mettez à jour le fichier JSON avec les utilisateurs restants
      await fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(filteredUsers, null, 2), 'utf8');

      res.json({ message: 'Utilisateur supprimé avec succès.' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
