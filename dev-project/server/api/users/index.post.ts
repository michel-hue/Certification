// API POST pour enregistrer un nouvel utilisateur
export default defineEventHandler(async (event) => {
  // Récupération des données envoyées
  const body = await readBody(event)
  const { nom, email, motDePasse } = body

  // Vérification des champs
  if (!nom || !email || !motDePasse) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Champs requis manquants.' }))
  }

  // Exemple : simulation de stockage (à remplacer par base de données)
  const utilisateurs = useStorage('utilisateurs')

  // Vérifie si l'email est déjà utilisé
  const existants = (await utilisateurs.getItem('liste')) || []
  const emailDejaPris = existants.find(u => u.email === email)

  if (emailDejaPris) {
    return sendError(event, createError({ statusCode: 409, statusMessage: 'Cet email est déjà utilisé.' }))
  }

  // Crée un nouvel utilisateur (mot de passe non hashé ici, à améliorer)
  const nouvelUtilisateur = {
    id: Date.now(),
    nom,
    email,
    motDePasse
  }

  // Sauvegarde
  existants.push(nouvelUtilisateur)
  await utilisateurs.setItem('liste', existants)

  // Retourne l'utilisateur sans le mot de passe
  const { motDePasse: _, ...sansMotDePasse } = nouvelUtilisateur
  return {
    message: 'Utilisateur créé avec succès',
    utilisateur: sansMotDePasse
  }
})
