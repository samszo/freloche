<?php
header('Content-Type: application/json; charset=utf-8');

$idCol = isset($_GET['idCol']) ? $_GET['idCol'] : false;
$idItem = isset($_GET['idItem']) ? $_GET['idItem'] : false;
$idFiles = isset($_GET['idFiles']) ? $_GET['idFiles'] : false;

// construction de l'url
if($idCol)$url = "https://octaviana.fr/api/items?collection=".$idCol;
if($idItem)$url = "https://octaviana.fr/api/items/".$idItem;
if($idFiles)$url = "https://octaviana.fr/api/files?item=".$idFiles;

// Création d'une nouvelle ressource cURL
$ch = curl_init();
// Configuration de l'URL et d'autres options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// Récupération de l'URL et affichage sur le navigateur
$response = curl_exec($ch);

// Fermeture de la session cURL
curl_close($ch);

if ($response === false) {
    die('Erreur cURL lors de la récupération du token : ' . curl_error($ch));
}

echo $response;

?>