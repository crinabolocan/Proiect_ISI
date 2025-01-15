-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: proiect_isi
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `review` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (90,6,'https://images.unsplash.com/photo-1706973319544-7583f02a9b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2OTYxMTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzY3OTkxMzJ8&ixlib=rb-4.0.3&q=80&w=400',63.70177007,11.12817212,NULL),(91,6,'https://images.unsplash.com/photo-1731963913936-d997c980181b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2OTYxMTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzY3OTkxMzJ8&ixlib=rb-4.0.3&q=80&w=400',38.74705521,-0.61645563,NULL),(92,6,'https://images.unsplash.com/photo-1733175697085-aa500b61ac74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2OTYxMTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzY4MTA5ODh8&ixlib=rb-4.0.3&q=80&w=400',57.72880245,29.00111473,NULL),(93,6,'https://images.unsplash.com/photo-1735406818135-72fc35b98960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2OTYxMTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzY4MTA5OTh8&ixlib=rb-4.0.3&q=80&w=400',37.20706745,-5.40467176,NULL),(94,6,'https://images.unsplash.com/photo-1736196074170-1946391dcbbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2OTYxMTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzY4MTEwMDV8&ixlib=rb-4.0.3&q=80&w=400',44.87216114,32.31255880,NULL);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photos` (
  `photo_id` varchar(255) DEFAULT NULL,
  `photo_url` text,
  `photo_image_url` text,
  `photo_submitted_at` datetime DEFAULT NULL,
  `photo_featured` varchar(1) DEFAULT NULL,
  `photo_width` int DEFAULT NULL,
  `photo_height` int DEFAULT NULL,
  `photo_aspect_ratio` float DEFAULT NULL,
  `photo_description` text,
  `photographer_username` varchar(255) DEFAULT NULL,
  `photographer_first_name` varchar(255) DEFAULT NULL,
  `photographer_last_name` varchar(255) DEFAULT NULL,
  `exif_camera_make` varchar(255) DEFAULT NULL,
  `exif_camera_model` varchar(255) DEFAULT NULL,
  `exif_iso` int DEFAULT NULL,
  `exif_aperture_value` float DEFAULT NULL,
  `exif_focal_length` float DEFAULT NULL,
  `exif_exposure_time` varchar(255) DEFAULT NULL,
  `photo_location_name` text,
  `photo_location_latitude` float DEFAULT NULL,
  `photo_location_longitude` float DEFAULT NULL,
  `photo_location_country` varchar(255) DEFAULT NULL,
  `photo_location_city` varchar(255) DEFAULT NULL,
  `stats_views` int DEFAULT NULL,
  `stats_downloads` int DEFAULT NULL,
  `ai_description` text,
  `ai_primary_landmark_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','crina@gmail.com','$2b$10$QEbz.ZP.kxMgKF.gdo6kW.dnQy5MB.xgZkRCYBz6bp.fMzhCAi4mO'),(3,'crina','maria@gmail.com','$2b$10$tLbkDJ12lY2e6XNd3pzxRuzvv8VpiPsI6xXoe/B8UndAECosn6CKm'),(4,'maria','augusta@gmail.com','$2b$10$ZSrTGwd4CwVTgY.VfvIQKuQrcrHolD4TvBnsuzPZy/PbSCbkn8RO6'),(5,'andrei','andrei@gmail.com','$2b$10$RAI5g660bptmNdh.jsagNudCfAOFp3cUa/.GMmo1Fe5uzYwAVQzYW'),(6,'andreea','andreea@gmail.com','$2b$10$8ohzX8dcjrAcHih3bOKfjOysExGzlLlmvXFyO6a4l4f.9BkKGIO1W'),(7,'diana','diana@gmail.com','$2b$10$3BsDkSV5smFV/xruRFS7WOiKBCokXf6quvnHS43y5v.v9y8M02a3K');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-15 17:03:40
