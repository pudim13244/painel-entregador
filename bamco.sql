-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 193.203.175.228    Database: u328800108_food_fly
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acrescimos`
--

DROP TABLE IF EXISTS `acrescimos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acrescimos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `establishment_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `establishment_id` (`establishment_id`),
  CONSTRAINT `acrescimos_ibfk_1` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acrescimos`
--

LOCK TABLES `acrescimos` WRITE;
/*!40000 ALTER TABLE `acrescimos` DISABLE KEYS */;
INSERT INTO `acrescimos` VALUES (1,'queijos',4.00,1,'2025-05-18 22:44:26'),(2,'Bacon',3.50,15,'2025-06-19 21:11:40'),(3,'Queijo Extra',2.00,15,'2025-06-19 21:11:40'),(4,'Catupiry',2.50,15,'2025-06-19 21:11:40'),(5,'Cebola Caramelizada',1.50,15,'2025-06-19 21:11:40'),(6,'Molho Especial',1.00,15,'2025-06-19 21:11:40'),(7,'Batata Palha',1.50,15,'2025-06-19 21:11:40'),(8,'Picles',0.50,15,'2025-06-19 21:11:40'),(9,'Maionese Verde',1.00,15,'2025-06-19 21:11:40');
/*!40000 ALTER TABLE `acrescimos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ads`
--

DROP TABLE IF EXISTS `ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('BANNER','POPUP','NOTIFICATION') NOT NULL,
  `status` enum('ACTIVE','INACTIVE','PENDING') NOT NULL DEFAULT 'PENDING',
  `image_url` varchar(255) DEFAULT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ads`
--

LOCK TABLES `ads` WRITE;
/*!40000 ALTER TABLE `ads` DISABLE KEYS */;
INSERT INTO `ads` VALUES (1,'teste','ee','NOTIFICATION','ACTIVE','','','2025-06-15 00:20:36','2025-06-15 00:20:36');
/*!40000 ALTER TABLE `ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caixa_pdv`
--

DROP TABLE IF EXISTS `caixa_pdv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caixa_pdv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estabelecimento_id` int(11) NOT NULL,
  `valor_inicial` decimal(10,2) NOT NULL,
  `data_abertura` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_fechamento` timestamp NULL DEFAULT NULL,
  `valor_fechamento` decimal(10,2) DEFAULT NULL,
  `status` enum('aberto','fechado') DEFAULT 'aberto',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `estabelecimento_id` (`estabelecimento_id`),
  CONSTRAINT `caixa_pdv_ibfk_1` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caixa_pdv`
--

LOCK TABLES `caixa_pdv` WRITE;
/*!40000 ALTER TABLE `caixa_pdv` DISABLE KEYS */;
INSERT INTO `caixa_pdv` VALUES (1,1,232.00,'2025-05-29 04:07:48',NULL,NULL,'aberto','2025-05-29 04:07:48','2025-05-29 04:07:48');
/*!40000 ALTER TABLE `caixa_pdv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `estabelecimento_id` int(11) NOT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `estabelecimento_id` (`estabelecimento_id`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Bebidas','Refrigerantes, sucos e água',1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(2,'Lanches','Sanduíches e hambúrgueres',1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(3,'Porções','Porções e petiscos',1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `establishment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categories_users` (`establishment_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_categories_users` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=737 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Lanches',NULL,1,NULL),(2,'Pizzas',NULL,1,NULL),(3,'Bebidas',NULL,1,NULL),(4,'Sobremesas',NULL,1,NULL),(5,'Combos',NULL,1,NULL),(727,'Hambúrguer artesanal','',0,15),(728,'Hot dogs','',0,15),(729,'Batatas','',0,15),(730,'Bebidas','',0,15),(731,'Cervejas','',0,15),(732,'Bebidas','',0,1),(733,'Lanches','',0,1),(734,'Sobremesas','',0,1),(735,'Pratos Principais','',0,1),(736,'Saladas','',0,1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_creation_log`
--

DROP TABLE IF EXISTS `category_creation_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_creation_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `script_name` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `request_data` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_creation_log`
--

LOCK TABLES `category_creation_log` WRITE;
/*!40000 ALTER TABLE `category_creation_log` DISABLE KEYS */;
INSERT INTO `category_creation_log` VALUES (1,727,'Hambúrguer artesanal',0,'2025-05-19 15:31:57','pc-casa','1008','AUTO_TRIGGER','establishment_id:15'),(2,728,'Hot dogs',0,'2025-05-19 15:32:04','pc-casa','1009','AUTO_TRIGGER','establishment_id:15'),(3,729,'Batatas',0,'2025-05-19 15:32:08','pc-casa','1010','AUTO_TRIGGER','establishment_id:15'),(4,730,'Bebidas',0,'2025-05-19 15:32:14','pc-casa','1011','AUTO_TRIGGER','establishment_id:15'),(5,731,'Cervejas',0,'2025-05-19 15:32:20','pc-casa','1012','AUTO_TRIGGER','establishment_id:15'),(6,732,'Bebidas',0,'2025-05-26 12:21:49','pc-casa','191','AUTO_TRIGGER','establishment_id:1'),(7,733,'Lanches',0,'2025-05-26 12:21:49','pc-casa','191','AUTO_TRIGGER','establishment_id:1'),(8,734,'Sobremesas',0,'2025-05-26 12:21:49','pc-casa','191','AUTO_TRIGGER','establishment_id:1'),(9,735,'Pratos Principais',0,'2025-05-26 12:21:49','pc-casa','191','AUTO_TRIGGER','establishment_id:1'),(10,736,'Saladas',0,'2025-05-26 12:21:49','pc-casa','191','AUTO_TRIGGER','establishment_id:1');
/*!40000 ALTER TABLE `category_creation_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_profile`
--

DROP TABLE IF EXISTS `delivery_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `vehicle_model` varchar(100) DEFAULT NULL,
  `has_plate` tinyint(1) DEFAULT 0,
  `plate` varchar(20) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_delivery_user` (`user_id`),
  CONSTRAINT `fk_delivery_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_profile`
--

LOCK TABLES `delivery_profile` WRITE;
/*!40000 ALTER TABLE `delivery_profile` DISABLE KEYS */;
INSERT INTO `delivery_profile` VALUES (1,9,'126.642.984-02','bicicleta','',0,'','https://drive.google.com/uc?id=1wgwq5FlISMda7DYLzmqNOpyj74QV2Li-','2025-06-17 10:15:38','2025-06-17 21:27:01');
/*!40000 ALTER TABLE `delivery_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estabelecimentos`
--

DROP TABLE IF EXISTS `estabelecimentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estabelecimentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(32) NOT NULL,
  `endereco` text DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estabelecimentos`
--

LOCK TABLES `estabelecimentos` WRITE;
/*!40000 ALTER TABLE `estabelecimentos` DISABLE KEYS */;
INSERT INTO `estabelecimentos` VALUES (1,'Meu Restaurante','restaurante@email.com','e10adc3949ba59abbe56e057f20f883e','Rua Exemplo, 123','(11) 99999-9999','ativo','2025-05-29 04:07:20','2025-05-29 04:07:20');
/*!40000 ALTER TABLE `estabelecimentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establishment_business_hours`
--

DROP TABLE IF EXISTS `establishment_business_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establishment_business_hours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `establishment_id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `open_time` time NOT NULL,
  `close_time` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `establishment_id` (`establishment_id`),
  CONSTRAINT `establishment_business_hours_ibfk_1` FOREIGN KEY (`establishment_id`) REFERENCES `establishment_profile` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establishment_business_hours`
--

LOCK TABLES `establishment_business_hours` WRITE;
/*!40000 ALTER TABLE `establishment_business_hours` DISABLE KEYS */;
INSERT INTO `establishment_business_hours` VALUES (6,8,1,'09:00:00','18:00:00'),(7,8,2,'09:00:00','18:00:00'),(161,7,1,'09:00:00','18:00:00'),(162,7,2,'09:00:00','18:00:00'),(163,7,5,'19:00:00','22:00:00'),(164,7,6,'19:00:00','22:00:00'),(165,7,7,'19:00:00','22:00:00');
/*!40000 ALTER TABLE `establishment_business_hours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establishment_delivery`
--

DROP TABLE IF EXISTS `establishment_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establishment_delivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `establishment_id` int(11) NOT NULL,
  `delivery_id` int(11) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `apply_fee` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_estdelivery_establishment` (`establishment_id`),
  KEY `fk_estdelivery_delivery` (`delivery_id`),
  CONSTRAINT `establishment_delivery_ibfk_1` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`),
  CONSTRAINT `establishment_delivery_ibfk_2` FOREIGN KEY (`delivery_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_estdelivery_delivery` FOREIGN KEY (`delivery_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_estdelivery_establishment` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establishment_delivery`
--

LOCK TABLES `establishment_delivery` WRITE;
/*!40000 ALTER TABLE `establishment_delivery` DISABLE KEYS */;
INSERT INTO `establishment_delivery` VALUES (2,15,9,1,1,'2025-05-21 23:19:32'),(4,1,9,1,1,'2025-05-26 13:25:02'),(5,1,8,0,1,'2025-06-02 21:32:47'),(9,15,8,0,1,'2025-06-28 16:57:28'),(10,15,22,0,1,'2025-06-29 14:31:20'),(11,15,9,0,1,'2025-06-29 14:31:25'),(12,15,8,0,1,'2025-06-29 14:31:33'),(13,15,22,0,1,'2025-06-29 14:31:41'),(14,15,9,0,1,'2025-06-29 14:31:46'),(15,15,8,0,1,'2025-06-29 15:22:25'),(16,15,22,0,1,'2025-06-30 10:18:06'),(17,15,9,0,1,'2025-07-01 17:16:06'),(18,15,22,0,1,'2025-07-01 17:16:16');
/*!40000 ALTER TABLE `establishment_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establishment_profile`
--

DROP TABLE IF EXISTS `establishment_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establishment_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `restaurant_name` varchar(255) NOT NULL,
  `business_hours` varchar(255) NOT NULL,
  `delivery_radius` int(11) NOT NULL DEFAULT 5,
  `pix_key` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `cuisine_type` varchar(50) NOT NULL,
  `minimum_order` decimal(10,2) NOT NULL DEFAULT 20.00,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 5.00,
  `logo_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `accepted_payment_methods` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '["CASH", "PIX", "CREDIT", "DEBIT"]' CHECK (json_valid(`accepted_payment_methods`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `only_linked_delivery` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_id` (`user_id`),
  CONSTRAINT `establishment_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establishment_profile`
--

LOCK TABLES `establishment_profile` WRITE;
/*!40000 ALTER TABLE `establishment_profile` DISABLE KEYS */;
INSERT INTO `establishment_profile` VALUES (1,1,'backlojinha','seg-sex-19 as 18',5,'179912882098','teste','brasileira',20.00,3.00,'uploads/logos/logo_682a973a62764.png','uploads/banners/banner_682a973a62b40.png','@backbolado','17 99754 8917','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-05-19 02:28:10','2025-05-19 02:28:10',1),(2,10,'Pizzaria Bella Napoli','Ter-Dom: 18h-23h',5,'11999999999','A melhor pizzaria italiana da cidade','pizzaria',40.00,5.00,NULL,NULL,'@bellanapoli','11999999999','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-05-19 02:31:19','2025-05-19 02:31:19',1),(3,11,'Hamburgueria Big Burger','Seg-Dom: 11h-23h',7,'11988888888','Hambúrgueres artesanais deliciosos','lanches',30.00,6.00,NULL,NULL,'@bigburger','11988888888','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-05-19 02:31:19','2025-05-19 02:31:19',1),(4,12,'Comida Japonesa Sakura','Seg-Sab: 11h-22h',6,'11977777777','O melhor da culinária japonesa','japonesa',50.00,7.00,NULL,NULL,'@sakurasushi','11977777777','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-05-19 02:31:19','2025-05-19 02:31:19',1),(5,13,'Doceria Sweet Dreams','Seg-Sab: 9h-20h',8,'11966666666','Doces e sobremesas artesanais','doces',25.00,8.00,NULL,NULL,'@sweetdreams','11966666666','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-05-19 02:31:19','2025-05-19 02:31:19',1),(6,14,'Restaurante Sabor Caseiro','Seg-Sex: 11h-15h',5,'11955555555','Comida caseira com sabor de mãe','brasileira',35.00,5.00,NULL,NULL,'@saborcaseiro','11955555555','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-05-19 02:31:19','2025-05-19 02:31:19',1),(7,15,'oba hot dog lanches','19:00 - 22:00',5,'18997158358','.','lanches',20.00,7.00,'/uploads/logos/logo_1750821293873-869620508.png','/uploads/banners/banner_1750821297580-353554666.png','@obahotdog','18997158358','[\"CASH\",\"CREDIT\",\"PIX\",\"DEBIT\"]','2025-06-01 04:12:45','2025-07-03 14:53:33',1),(8,44,'backlojinh1','[]',5,'179912882093','232','lanches',20.00,5.00,NULL,NULL,'@obahotdo3','18997158358','[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-06-29 22:33:23','2025-06-29 22:33:54',1),(9,46,'','[]',5,'','','',20.00,5.00,NULL,NULL,NULL,NULL,'[\"CASH\", \"PIX\", \"CREDIT\", \"DEBIT\"]','2025-07-03 15:25:29','2025-07-03 15:25:29',1);
/*!40000 ALTER TABLE `establishment_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_venda_pdv`
--

DROP TABLE IF EXISTS `itens_venda_pdv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_venda_pdv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venda_id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `venda_id` (`venda_id`),
  KEY `produto_id` (`produto_id`),
  CONSTRAINT `itens_venda_pdv_ibfk_1` FOREIGN KEY (`venda_id`) REFERENCES `vendas_pdv` (`id`),
  CONSTRAINT `itens_venda_pdv_ibfk_2` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_venda_pdv`
--

LOCK TABLES `itens_venda_pdv` WRITE;
/*!40000 ALTER TABLE `itens_venda_pdv` DISABLE KEYS */;
/*!40000 ALTER TABLE `itens_venda_pdv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentacoes_caixa`
--

DROP TABLE IF EXISTS `movimentacoes_caixa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentacoes_caixa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caixa_id` int(11) NOT NULL,
  `tipo` enum('entrada','saida') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `descricao` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `caixa_id` (`caixa_id`),
  CONSTRAINT `movimentacoes_caixa_ibfk_1` FOREIGN KEY (`caixa_id`) REFERENCES `caixa_pdv` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentacoes_caixa`
--

LOCK TABLES `movimentacoes_caixa` WRITE;
/*!40000 ALTER TABLE `movimentacoes_caixa` DISABLE KEYS */;
INSERT INTO `movimentacoes_caixa` VALUES (1,1,'entrada',232.00,'Abertura de caixa','2025-05-29 04:07:48');
/*!40000 ALTER TABLE `movimentacoes_caixa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option_groups`
--

DROP TABLE IF EXISTS `option_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `option_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT 0,
  `min_selections` int(11) DEFAULT 0,
  `max_selections` int(11) DEFAULT 1,
  `establishment_id` int(11) NOT NULL,
  `product_type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `establishment_id` (`establishment_id`),
  CONSTRAINT `option_groups_ibfk_1` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option_groups`
--

LOCK TABLES `option_groups` WRITE;
/*!40000 ALTER TABLE `option_groups` DISABLE KEYS */;
INSERT INTO `option_groups` VALUES (2,'Cheddar Extra','Grupo de opções: Cheddar Extra',0,0,7,15,'EXTRA','2025-05-19 15:19:20'),(3,'acréscimos','Grupo de opções: acréscimos',0,0,10,15,'EXTRA','2025-05-19 15:20:20'),(4,'Hambúrgueres','Grupo de opções: Hambúrgueres',0,1,1,15,'EXTRA','2025-05-19 15:29:38');
/*!40000 ALTER TABLE `option_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `additional_price` decimal(10,2) DEFAULT 0.00,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `options_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `option_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (2,2,'cheddar cremoso','Opção: cheddar cremoso',2.00,1,'2025-05-19 15:19:49'),(3,3,'maionese verde extra (25 g)','Opção: maionese verde extra (25 g)',1.00,1,'2025-05-19 15:20:37'),(4,3,'cebola roxa','Opção: cebola roxa',6.00,1,'2025-05-19 15:20:51'),(5,3,'bacon','Opção: bacon',6.00,1,'2025-05-19 15:23:12'),(6,3,'calabresa','Opção: calabresa',4.00,1,'2025-05-19 15:23:23'),(7,3,'frango','Opção: frango',5.00,1,'2025-05-19 15:23:33'),(8,3,'ovo frito','Opção: ovo frito',2.50,1,'2025-05-19 15:23:53'),(9,3,'cheddar cremoso','Opção: cheddar cremoso',2.00,1,'2025-05-19 15:24:04'),(10,3,'catupiry','Opção: catupiry',2.00,1,'2025-05-19 15:24:13'),(11,3,'salsicha','Opção: salsicha',2.00,1,'2025-05-19 15:24:21'),(12,3,'presunto','Opção: presunto',2.50,1,'2025-05-19 15:24:31'),(13,3,'mussarela','Opção: mussarela',5.00,1,'2025-05-19 15:25:05'),(14,3,'cheddar fatiado Polenghi','Opção: cheddar fatiado Polenghi',4.00,1,'2025-05-19 15:27:48'),(15,3,'batata palha','Opção: batata palha',1.00,1,'2025-05-19 15:27:59'),(16,3,'tomate','Opção: tomate',1.00,1,'2025-05-19 15:28:09'),(17,3,'hamburguer tradicional','Opção: hamburguer tradicional',4.00,1,'2025-05-19 15:28:18'),(18,3,'hamburguer artesanal de carne','Opção: hamburguer artesanal de carne',10.00,1,'2025-05-19 15:28:28'),(19,3,'hamburguer artesanal de frango','Opção: hamburguer artesanal de frango',8.00,1,'2025-05-19 15:28:38'),(20,3,'hamburguer artesanal de linguiça','Opção: hamburguer artesanal de linguiça',8.00,1,'2025-05-19 15:28:48'),(21,4,'2 carne bovina e 1 linguiça','Opção: 2 carne bovina e 1 linguiça',2.50,1,'2025-05-19 15:29:57'),(22,4,'2 carne bovina e 1 frango','Opção: 2 carne bovina e 1 frango',2.50,1,'2025-05-19 15:30:11'),(23,4,'Todos de carne bovina','Opção: Todos de carne bovina',5.00,1,'2025-05-19 15:30:25'),(25,3,'VITOR Santos','',89.00,1,'2025-06-19 22:28:12');
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item_acrescimo`
--

DROP TABLE IF EXISTS `order_item_acrescimo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item_acrescimo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NOT NULL,
  `acrescimo_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_item_id` (`order_item_id`),
  KEY `fk_order_item_acrescimo_option` (`acrescimo_id`),
  CONSTRAINT `fk_order_item_acrescimo_option` FOREIGN KEY (`acrescimo_id`) REFERENCES `options` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_item_acrescimo_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item_acrescimo`
--

LOCK TABLES `order_item_acrescimo` WRITE;
/*!40000 ALTER TABLE `order_item_acrescimo` DISABLE KEYS */;
INSERT INTO `order_item_acrescimo` VALUES (1,76,5,4,6.00),(2,77,5,1,6.00),(3,77,15,3,1.00),(4,78,5,3,6.00),(5,79,5,3,6.00),(6,79,15,1,1.00),(7,80,5,1,6.00),(8,81,5,2,6.00),(9,82,5,1,6.00),(10,82,15,1,1.00),(11,83,5,1,6.00),(12,84,5,2,6.00),(13,84,15,1,1.00),(14,84,6,1,4.00),(15,84,10,1,2.00),(16,84,4,1,6.00),(17,84,9,1,2.00),(18,84,14,1,4.00),(19,84,7,2,5.00),(20,84,18,1,10.00),(21,84,19,1,8.00),(22,84,20,1,8.00),(23,84,17,2,4.00),(24,84,3,1,1.00),(25,84,13,1,5.00),(26,84,8,1,2.50),(27,84,12,1,2.50),(28,84,11,1,2.00),(29,84,16,1,1.00),(30,86,22,1,2.50),(31,88,15,1,1.00),(32,89,5,1,6.00),(33,97,15,1,1.00),(34,97,6,1,4.00),(35,97,12,1,2.50),(36,98,5,1,6.00),(37,98,10,1,2.00),(38,98,22,1,2.50),(39,99,21,1,2.50),(40,100,16,1,1.00),(41,101,12,1,2.50),(42,101,23,1,5.00),(43,107,11,1,2.00),(44,107,14,1,4.00),(45,107,20,1,8.00),(46,108,9,1,2.00),(47,108,12,1,2.50),(48,108,15,1,1.00),(49,108,20,1,8.00),(50,113,21,1,2.50),(51,114,11,1,2.00),(52,114,14,1,4.00),(53,116,5,3,6.00),(54,116,3,2,1.00),(55,117,5,2,6.00),(56,119,15,4,1.00),(57,120,15,2,1.00),(58,121,6,2,4.00),(59,122,5,1,6.00),(60,122,15,1,1.00),(61,124,15,1,1.00),(62,125,5,2,6.00),(63,130,5,1,6.00),(64,130,16,1,1.00),(65,130,22,1,2.50),(66,131,21,1,2.50),(67,132,8,1,2.50),(68,132,12,1,2.50),(69,133,20,1,8.00),(70,136,22,1,2.50),(71,137,19,1,8.00),(72,138,15,1,1.00),(73,139,6,1,4.00),(74,140,22,2,2.50),(75,141,15,1,1.00),(76,141,10,1,2.00),(77,145,6,1,4.00),(78,147,5,1,6.00),(79,149,15,1,1.00),(80,152,15,1,1.00),(81,152,6,1,4.00),(82,153,5,1,6.00),(83,180,5,1,6.00),(84,180,15,1,1.00),(85,189,3,1,0.00),(86,189,4,1,0.00),(87,190,3,1,0.00),(88,190,4,1,0.00),(89,191,3,1,1.00),(90,192,4,1,6.00),(91,192,5,1,6.00),(92,194,3,1,1.00),(93,194,4,1,6.00),(96,199,3,1,1.00),(97,199,10,1,2.00),(98,199,9,1,2.00),(99,199,11,1,2.00),(100,202,15,1,1.00),(101,202,6,1,4.00),(102,203,15,1,1.00),(103,203,10,1,2.00),(104,204,6,1,4.00),(105,205,7,1,5.00),(114,225,3,1,1.00),(115,225,4,1,6.00),(116,226,3,1,1.00),(117,226,4,1,6.00),(118,227,6,1,4.00),(119,227,5,1,6.00),(120,227,8,1,2.50),(121,228,6,1,4.00),(122,228,5,1,6.00),(123,228,8,1,2.50),(126,232,4,1,6.00),(127,232,3,1,1.00),(131,234,3,1,1.00),(132,234,4,1,6.00),(133,235,3,1,1.00),(137,237,2,1,2.00),(138,237,21,1,2.50),(139,237,4,1,6.00),(142,239,2,1,2.00),(143,239,22,1,2.50),(144,240,4,1,6.00),(145,240,3,1,1.00),(146,240,22,1,2.50),(147,242,4,1,6.00),(148,242,3,1,1.00),(149,243,2,1,2.00),(150,243,3,1,1.00),(151,243,4,1,6.00);
/*!40000 ALTER TABLE `order_item_acrescimo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `obs` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderitems_orders` (`order_id`),
  KEY `fk_orderitems_products` (`product_id`),
  CONSTRAINT `fk_orderitems_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitems_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,22.00,NULL),(5,5,1,1,22.00,NULL),(7,6,1,2,22.00,NULL),(8,7,1,1,22.00,NULL),(9,8,1,1,22.00,NULL),(14,13,1,1,22.00,NULL),(15,14,1,1,22.00,NULL),(16,15,1,1,22.00,NULL),(17,16,1,1,22.00,NULL),(20,17,1,1,22.00,NULL),(21,18,1,1,22.00,NULL),(22,23,2,1,30.90,NULL),(23,24,2,1,30.90,NULL),(24,25,2,1,39.90,NULL),(27,26,2,1,30.90,NULL),(28,27,2,1,40.90,NULL),(29,28,2,1,35.90,NULL),(30,29,4,1,45.40,NULL),(31,29,3,1,27.00,NULL),(32,30,1,2,22.00,NULL),(33,31,1,1,22.00,NULL),(34,32,1,1,22.00,NULL),(40,33,12,1,8.00,NULL),(41,33,16,1,18.00,NULL),(42,33,17,1,22.00,NULL),(43,34,21,1,5.00,NULL),(44,34,31,1,20.00,NULL),(45,34,32,3,35.00,NULL),(46,34,14,1,6.00,NULL),(47,35,22,1,4.00,NULL),(48,36,23,1,5.50,NULL),(49,36,9,1,15.00,NULL),(50,36,22,1,4.00,NULL),(51,37,12,1,8.00,NULL),(52,38,28,1,6.50,NULL),(53,39,23,1,5.50,NULL),(54,40,2,1,30.90,NULL),(55,40,4,1,38.90,NULL),(56,41,2,1,30.90,NULL),(57,41,3,3,22.00,NULL),(58,41,5,2,12.90,NULL),(59,42,5,2,12.90,NULL),(60,42,4,3,38.90,NULL),(61,43,5,1,12.90,NULL),(62,43,3,10,22.00,NULL),(63,43,2,2,30.90,NULL),(64,43,4,1,38.90,NULL),(65,44,2,2,30.90,NULL),(66,44,3,3,22.00,NULL),(67,44,4,2,38.90,NULL),(68,44,5,3,12.90,NULL),(69,45,2,1,30.90,NULL),(70,47,2,1,36.90,NULL),(76,53,2,1,54.90,NULL),(77,54,2,1,39.90,NULL),(78,57,2,1,48.90,'hgdfshdh'),(79,58,2,1,49.90,'teste'),(80,59,2,1,36.90,'teste'),(81,60,2,1,42.90,''),(82,61,2,1,37.90,'teste'),(83,62,2,1,36.90,''),(84,63,2,1,119.90,''),(85,64,5,1,12.90,''),(86,65,4,1,41.40,''),(87,66,3,1,22.00,''),(88,70,3,1,23.00,''),(89,71,3,1,28.00,''),(90,72,5,1,12.90,''),(91,73,1,1,22.00,''),(92,73,18,1,14.00,''),(93,73,31,1,20.00,''),(94,73,24,1,25.00,''),(95,74,29,1,8.00,''),(96,74,12,1,8.00,''),(97,75,2,1,38.40,'sem alface'),(98,76,4,1,49.40,''),(99,76,4,1,41.40,''),(100,76,5,1,13.90,''),(101,77,4,1,46.40,''),(102,78,12,1,8.00,''),(103,78,29,1,8.00,''),(104,79,28,1,6.50,''),(105,80,17,1,22.00,''),(106,80,31,1,20.00,''),(107,81,2,1,30.90,'Sem salada'),(108,82,2,1,30.90,NULL),(109,83,2,1,30.90,NULL),(110,84,1,1,22.00,NULL),(111,85,1,1,22.00,NULL),(112,86,1,1,22.00,NULL),(113,87,4,1,38.90,NULL),(114,88,3,1,2202.00,NULL),(115,89,1,1,22.00,NULL),(116,90,2,1,50.90,''),(117,91,5,1,24.90,''),(118,92,2,1,30.90,''),(119,93,3,1,26.00,''),(120,94,5,1,14.90,''),(121,95,5,1,20.90,''),(122,96,5,1,19.90,''),(123,97,3,1,22.00,''),(124,98,5,1,13.90,''),(125,99,3,1,34.00,''),(126,100,35,1,40.00,''),(127,101,1,1,22.00,NULL),(128,101,2,1,30.90,NULL),(129,102,35,1,40.00,''),(130,103,4,1,48.40,''),(131,104,4,1,41.40,''),(132,105,5,1,12.90,NULL),(133,106,2,1,30.91,NULL),(134,107,2,1,30.90,NULL),(135,108,2,1,30.90,NULL),(136,109,4,1,38.90,NULL),(137,109,3,1,2208.00,NULL),(138,110,3,1,23.00,'sem cebosa'),(139,111,3,1,26.00,''),(140,112,4,1,43.90,'sem calabresa'),(141,113,3,1,25.00,''),(142,114,5,1,12.90,'sei tasa'),(144,115,2,1,30.90,NULL),(145,116,3,1,2204.00,NULL),(146,117,2,1,30.90,''),(147,118,2,1,36.90,''),(148,119,2,1,30.90,''),(149,120,5,1,13.90,''),(150,121,3,1,22.00,''),(151,122,3,1,22.00,''),(152,123,3,1,27.00,''),(153,124,2,1,36.90,''),(154,125,3,1,22.00,NULL),(155,126,3,1,22.00,NULL),(156,126,4,1,38.90,NULL),(157,127,2,1,30.90,NULL),(158,128,4,1,38.90,NULL),(159,129,3,1,22.00,NULL),(160,130,3,1,22.00,NULL),(161,131,3,1,22.00,NULL),(162,132,2,1,30.90,NULL),(163,133,3,1,22.00,NULL),(164,134,3,1,22.00,NULL),(165,135,4,1,38.90,NULL),(166,136,4,1,38.90,NULL),(167,136,5,1,12.90,NULL),(168,137,5,1,12.90,NULL),(169,138,2,1,30.90,NULL),(170,139,5,1,12.90,NULL),(171,140,4,1,38.90,NULL),(172,140,3,1,22.00,NULL),(173,141,3,1,22.00,NULL),(174,141,2,1,30.90,NULL),(175,141,4,1,38.90,NULL),(176,142,3,1,22.00,NULL),(177,142,2,1,30.90,NULL),(178,143,2,1,30.90,NULL),(179,144,2,1,30.90,NULL),(180,145,2,1,37.90,''),(181,146,3,1,22.00,NULL),(182,147,3,1,22.00,NULL),(183,148,2,1,30.90,NULL),(184,149,4,1,38.90,NULL),(185,150,2,1,30.90,'teste13'),(186,151,2,1,30.90,'teste13'),(187,152,3,1,22.00,'retuu'),(188,153,2,1,30.90,'upaa'),(189,154,2,1,30.90,'por favor me '),(190,155,3,1,22.00,NULL),(191,156,2,1,30.90,'tested'),(192,157,3,1,22.00,'teeeste'),(193,158,4,1,38.90,NULL),(194,159,2,1,30.90,'é um dos '),(196,161,38,1,345.00,NULL),(197,162,5,1,12.90,NULL),(198,163,2,1,30.90,NULL),(199,163,2,1,30.90,'teste'),(200,164,38,1,345.00,''),(201,165,35,1,40.00,''),(202,166,5,1,17.90,''),(203,167,5,1,15.90,''),(204,168,3,1,26.00,''),(205,169,5,1,17.90,''),(206,170,35,1,40.00,''),(223,171,38,1,345.00,NULL),(224,171,2,2,30.90,NULL),(225,171,2,1,30.90,NULL),(226,160,3,1,22.00,'por favor '),(227,172,2,1,30.90,NULL),(228,173,2,1,30.90,NULL),(231,175,4,1,38.90,NULL),(232,175,3,1,22.00,NULL),(234,177,4,1,38.90,NULL),(235,178,3,1,22.00,NULL),(237,179,2,1,30.90,NULL),(239,180,2,1,30.90,'tste e '),(240,176,4,1,38.90,NULL),(241,174,4,1,38.90,NULL),(242,174,3,1,22.00,NULL),(243,181,2,1,30.90,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `establishment_id` int(11) NOT NULL,
  `delivery_id` int(11) DEFAULT NULL,
  `status` enum('PENDING','PREPARING','READY','DELIVERING','DELIVERED','CANCELLED') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 3.00,
  `payment_method` enum('CASH','CREDIT','DEBIT','PIX') NOT NULL,
  `order_type` enum('DELIVERY','DINE_IN','PICKUP') NOT NULL DEFAULT 'DELIVERY',
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `change_amount` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('PENDING','PAID') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `delivery_address` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_customer` (`customer_id`),
  KEY `fk_orders_establishment` (`establishment_id`),
  KEY `fk_orders_delivery` (`delivery_id`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `fk_orders_delivery` FOREIGN KEY (`delivery_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_establishment` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`delivery_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,1,NULL,'DELIVERED',22.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-18 21:28:00',NULL,NULL),(5,7,1,NULL,'DELIVERED',22.00,3.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-05-18 21:44:25',NULL,NULL),(6,7,1,NULL,'DELIVERING',44.00,3.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-05-18 21:47:40',NULL,NULL),(7,7,1,9,'DELIVERED',22.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-18 21:57:21',NULL,NULL),(8,7,1,NULL,'DELIVERED',22.00,3.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-05-18 22:45:13',NULL,NULL),(13,7,1,9,'DELIVERED',22.00,3.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-05-18 23:18:22',NULL,NULL),(14,7,1,9,'DELIVERED',22.00,3.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-05-18 23:55:32',NULL,NULL),(15,7,1,9,'DELIVERED',22.00,3.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-05-19 00:03:53',NULL,NULL),(16,7,1,9,'DELIVERED',22.00,3.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-05-19 01:54:46',NULL,NULL),(17,7,1,9,'DELIVERED',22.00,3.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-05-19 02:29:18',NULL,NULL),(18,7,1,9,'DELIVERED',22.00,3.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-05-19 13:55:13',NULL,NULL),(23,7,15,NULL,'DELIVERED',30.90,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-19 23:55:03',NULL,NULL),(24,7,15,NULL,'DELIVERED',30.90,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-19 23:55:19',NULL,NULL),(25,7,15,NULL,'DELIVERED',39.90,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-19 23:56:44',NULL,NULL),(26,7,15,9,'DELIVERED',30.90,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-21 23:10:56',NULL,NULL),(27,7,15,9,'DELIVERED',40.90,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-22 00:06:55',NULL,NULL),(28,7,15,9,'DELIVERED',35.90,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-22 00:09:28',NULL,NULL),(29,7,15,9,'DELIVERED',72.40,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-22 00:36:04',NULL,NULL),(30,7,1,9,'DELIVERED',44.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 11:10:45',NULL,NULL),(31,7,1,9,'DELIVERED',22.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 12:06:22',NULL,NULL),(32,7,1,NULL,'PENDING',22.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 12:07:38',NULL,NULL),(33,7,1,9,'DELIVERED',48.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 12:22:36',NULL,NULL),(34,2,1,NULL,'CANCELLED',136.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 13:01:40',NULL,NULL),(35,2,1,NULL,'PENDING',4.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 13:02:16',NULL,NULL),(36,2,1,NULL,'PENDING',24.50,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 13:04:35',NULL,NULL),(37,2,1,NULL,'PENDING',8.00,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 13:21:14',NULL,NULL),(38,2,1,NULL,'PENDING',6.50,3.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-05-26 13:22:44',NULL,NULL),(39,2,1,9,'DELIVERED',5.50,3.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-26 13:24:30',NULL,NULL),(40,7,15,9,'DELIVERED',69.80,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-05-31 09:25:53',NULL,NULL),(41,7,15,9,'DELIVERED',122.70,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-31 09:28:24',NULL,NULL),(42,7,15,9,'DELIVERED',142.50,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-31 10:02:08',NULL,NULL),(43,7,15,9,'DELIVERED',333.60,0.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-05-31 10:09:42',NULL,NULL),(44,7,15,9,'DELIVERED',244.30,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-05-31 10:18:31',NULL,NULL),(45,7,15,NULL,'DELIVERED',30.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-05-31 10:27:31',NULL,NULL),(47,7,15,9,'DELIVERED',36.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 02:17:14',NULL,NULL),(53,7,15,NULL,'DELIVERED',78.90,0.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 02:30:21',NULL,NULL),(54,7,15,NULL,'DELIVERED',48.90,0.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 02:30:48',NULL,NULL),(57,7,15,NULL,'DELIVERED',66.90,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-01 02:51:05',NULL,NULL),(58,7,15,NULL,'DELIVERED',68.90,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-01 02:58:27',NULL,NULL),(59,7,15,NULL,'DELIVERED',42.90,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-01 02:59:44',NULL,NULL),(60,7,15,NULL,'DELIVERED',54.90,0.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-01 03:00:42',NULL,NULL),(61,7,15,NULL,'DELIVERED',44.90,0.00,'CASH','DELIVERY',50.00,12.10,'PENDING','2025-06-01 03:02:57',NULL,NULL),(62,7,15,9,'DELIVERED',42.90,0.00,'CASH','DELIVERY',50.00,13.10,'PENDING','2025-06-01 03:37:54',NULL,NULL),(63,7,15,9,'DELIVERED',208.90,0.00,'CASH','DELIVERY',150.00,30.10,'PENDING','2025-06-01 03:43:50',NULL,NULL),(64,7,15,NULL,'DELIVERED',12.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 03:56:28',NULL,NULL),(65,7,15,NULL,'DELIVERED',43.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 03:57:28',NULL,NULL),(66,7,15,NULL,'DELIVERED',22.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 03:59:43',NULL,NULL),(70,7,15,NULL,'DELIVERED',24.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 04:08:40',NULL,NULL),(71,19,15,9,'DELIVERED',34.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 04:10:11',NULL,NULL),(72,19,15,9,'DELIVERED',12.90,0.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-01 04:10:40',NULL,NULL),(73,7,1,9,'DELIVERED',81.00,0.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-02 21:32:02',NULL,NULL),(74,7,1,NULL,'PENDING',16.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-02 21:43:42',NULL,NULL),(75,21,15,9,'DELIVERED',45.90,0.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-02 22:52:15',NULL,NULL),(76,23,15,22,'DELIVERED',118.70,0.00,'CASH','DELIVERY',170.00,65.30,'PENDING','2025-06-02 23:14:59',NULL,NULL),(77,7,15,9,'DELIVERED',53.90,0.00,'CASH','DELIVERY',100.00,53.60,'PENDING','2025-06-03 09:38:54',NULL,NULL),(78,7,1,9,'DELIVERED',16.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-05 12:39:59',NULL,NULL),(79,7,1,9,'DELIVERED',6.50,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-06 12:49:58',NULL,NULL),(80,7,1,NULL,'DELIVERING',42.00,0.00,'CASH','DELIVERY',100.00,58.00,'PENDING','2025-06-06 21:42:41',NULL,NULL),(81,24,15,NULL,'DELIVERED',44.90,4.99,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-08 21:22:49',NULL,NULL),(82,24,15,22,'DELIVERED',44.40,4.99,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-08 21:48:25',NULL,NULL),(83,24,15,NULL,'DELIVERED',30.90,4.99,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-09 00:03:51',NULL,NULL),(84,31,1,NULL,'PENDING',22.00,4.99,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-13 16:41:28',NULL,NULL),(85,24,1,NULL,'PENDING',22.00,4.99,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-13 20:39:43',NULL,NULL),(86,32,1,NULL,'PENDING',22.00,4.99,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-13 21:17:02',NULL,NULL),(87,32,15,NULL,'DELIVERED',41.40,4.99,'','DELIVERY',NULL,NULL,'PENDING','2025-06-13 22:24:09',NULL,NULL),(88,32,15,NULL,'DELIVERED',2208.00,4.99,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-13 22:27:02',NULL,NULL),(89,37,1,NULL,'PENDING',22.00,4.99,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-15 20:15:17',NULL,NULL),(90,19,15,9,'DELIVERED',70.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 02:20:56',NULL,NULL),(91,7,15,9,'DELIVERED',36.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 02:22:56',NULL,NULL),(92,38,15,9,'DELIVERED',30.90,0.00,'CASH','DELIVERY',50.00,19.10,'PENDING','2025-06-16 11:55:58',NULL,NULL),(93,19,15,9,'DELIVERED',30.00,0.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 15:37:10',NULL,NULL),(94,19,15,9,'DELIVERED',16.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 15:46:10',NULL,NULL),(95,7,15,22,'DELIVERED',28.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 16:08:23',NULL,NULL),(96,7,15,22,'DELIVERED',26.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 22:13:12',NULL,NULL),(97,19,15,9,'DELIVERED',22.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 22:15:40',NULL,NULL),(98,19,15,9,'DELIVERED',14.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 22:16:48',NULL,NULL),(99,39,15,9,'DELIVERED',46.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 22:19:21',NULL,NULL),(100,40,15,9,'DELIVERED',40.00,0.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-16 22:20:35',NULL,NULL),(101,41,1,NULL,'PENDING',52.90,4.99,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-17 02:05:12',NULL,NULL),(102,7,15,22,'DELIVERED',40.00,0.00,'CASH','DELIVERY',50.00,10.00,'PENDING','2025-06-17 22:23:19',NULL,NULL),(103,19,15,22,'DELIVERED',57.90,0.00,'CASH','DELIVERY',50.00,1.60,'PENDING','2025-06-17 22:24:20',NULL,NULL),(104,19,15,NULL,'DELIVERED',43.90,0.00,'CASH','DELIVERY',50.00,8.60,'PENDING','2025-06-17 23:06:53',NULL,NULL),(105,31,15,NULL,'DELIVERED',17.90,4.99,'CASH','DELIVERY',100.00,77.10,'PENDING','2025-06-18 01:18:13',NULL,NULL),(106,31,15,NULL,'DELIVERED',38.91,4.99,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 01:22:29',NULL,NULL),(107,31,15,NULL,'DELIVERED',30.90,4.99,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 01:28:17',NULL,NULL),(108,31,15,NULL,'DELIVERED',30.90,4.99,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 01:52:11',NULL,NULL),(109,31,15,NULL,'DELIVERED',2257.40,4.99,'CASH','DELIVERY',100.00,23.60,'PENDING','2025-06-18 01:54:48',NULL,NULL),(110,7,15,9,'DELIVERED',24.00,0.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 01:56:20',NULL,NULL),(111,19,15,NULL,'DELIVERED',30.00,0.00,'CASH','DELIVERY',0.00,0.00,'PENDING','2025-06-18 15:25:29',NULL,NULL),(112,19,15,NULL,'DELIVERED',48.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 15:26:01',NULL,NULL),(113,19,15,NULL,'DELIVERED',28.00,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 15:29:20',NULL,NULL),(114,19,15,NULL,'DELIVERED',12.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 15:29:48',NULL,NULL),(115,31,15,NULL,'DELIVERED',30.90,4.99,'CREDIT','DELIVERY',NULL,NULL,'PAID','2025-06-18 15:30:49',NULL,NULL),(116,31,15,NULL,'CANCELLED',2208.00,4.99,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 16:56:33',NULL,NULL),(117,19,15,NULL,'DELIVERED',30.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 21:14:59',NULL,NULL),(118,19,15,NULL,'DELIVERED',42.90,0.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 21:16:55',NULL,NULL),(119,7,15,NULL,'DELIVERED',30.90,5.00,'CASH','DELIVERY',0.00,0.00,'PENDING','2025-06-18 21:19:46',NULL,NULL),(120,7,15,NULL,'DELIVERED',14.90,5.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 21:39:08',NULL,NULL),(121,7,15,NULL,'DELIVERED',22.00,5.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-18 21:45:21',NULL,NULL),(122,7,15,NULL,'DELIVERED',22.00,5.00,'CASH','DINE_IN',0.00,0.00,'PENDING','2025-06-18 21:45:40',NULL,NULL),(123,7,15,NULL,'DELIVERED',32.00,5.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-19 13:06:43',NULL,NULL),(124,7,15,9,'READY',42.90,5.00,'CASH','DELIVERY',50.00,8.10,'PENDING','2025-06-19 13:51:19',NULL,NULL),(125,15,15,NULL,'DELIVERED',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 01:06:48',NULL,NULL),(126,15,15,NULL,'DELIVERED',60.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 01:07:29',NULL,NULL),(127,42,15,NULL,'DELIVERED',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 15:32:08',NULL,NULL),(128,7,15,NULL,'DELIVERED',38.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 15:32:40',NULL,NULL),(129,42,15,9,'DELIVERED',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 16:47:56',NULL,NULL),(130,7,15,NULL,'DELIVERED',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 21:25:24',NULL,NULL),(131,42,15,NULL,'CANCELLED',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 21:28:22',NULL,NULL),(132,42,15,NULL,'READY',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 21:36:13',NULL,NULL),(133,7,15,NULL,'READY',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 22:07:34',NULL,NULL),(134,7,15,NULL,'READY',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 22:14:44',NULL,NULL),(135,19,15,NULL,'READY',38.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 22:16:23',NULL,NULL),(136,7,15,9,'DELIVERED',51.80,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-26 22:20:45',NULL,NULL),(137,43,15,NULL,'READY',12.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 23:34:03',NULL,NULL),(138,43,15,NULL,'READY',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 23:34:53',NULL,NULL),(139,43,15,NULL,'READY',12.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 23:35:16',NULL,NULL),(140,7,15,9,'READY',60.90,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-26 23:37:22',NULL,NULL),(141,7,15,22,'READY',91.80,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-26 23:40:29',NULL,NULL),(142,7,15,22,'DELIVERED',52.90,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-26 23:44:58',NULL,NULL),(143,7,15,8,'DELIVERED',30.90,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-26 23:49:09',NULL,NULL),(144,43,15,NULL,'READY',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-26 23:51:37',NULL,NULL),(145,7,15,NULL,'DELIVERED',44.90,80.00,'DEBIT','PICKUP',NULL,NULL,'PENDING','2025-06-27 01:25:18',NULL,NULL),(146,43,15,NULL,'READY',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-27 01:33:17',NULL,NULL),(147,43,15,NULL,'READY',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-27 01:33:58',NULL,NULL),(148,7,15,22,'DELIVERED',30.90,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-27 21:55:21',NULL,NULL),(149,43,15,NULL,'PREPARING',38.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:26:25',NULL,NULL),(150,43,15,NULL,'PREPARING',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:34:07',NULL,NULL),(151,43,15,NULL,'PREPARING',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:36:00',NULL,NULL),(152,43,15,NULL,'PREPARING',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:36:22',NULL,NULL),(153,43,15,NULL,'PREPARING',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:39:30',NULL,NULL),(154,43,15,NULL,'PREPARING',30.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:41:41',NULL,NULL),(155,43,15,NULL,'PREPARING',22.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:53:57',NULL,NULL),(156,43,15,NULL,'PREPARING',31.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 17:58:47',NULL,NULL),(157,7,15,8,'DELIVERED',34.00,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-28 18:03:50',NULL,NULL),(158,19,15,NULL,'READY',38.90,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-28 18:10:12',NULL,NULL),(159,7,15,NULL,'READY',37.90,80.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 18:16:35',NULL,NULL),(160,7,15,8,'READY',109.00,80.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 18:18:36',NULL,NULL),(161,7,15,22,'READY',345.00,80.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-28 18:22:53',NULL,NULL),(162,19,15,NULL,'READY',12.90,80.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-28 18:25:50',NULL,NULL),(163,43,15,NULL,'DELIVERED',70.80,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-28 18:44:58',NULL,NULL),(164,7,15,NULL,'DELIVERED',425.00,80.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:24:37',NULL,NULL),(165,7,15,NULL,'DELIVERED',120.00,80.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:27:36',NULL,NULL),(166,19,15,NULL,'DELIVERED',97.90,80.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:28:30',NULL,NULL),(167,19,15,NULL,'DELIVERED',95.90,80.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:35:43',NULL,NULL),(168,7,15,NULL,'DELIVERED',106.00,80.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:36:19',NULL,NULL),(169,7,15,NULL,'DELIVERED',97.90,80.00,'CREDIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:38:13',NULL,NULL),(170,19,15,NULL,'DELIVERED',120.00,80.00,'DEBIT','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:42:56',NULL,NULL),(171,7,15,NULL,'READY',524.70,80.00,'PIX','DELIVERY',NULL,NULL,'PENDING','2025-06-28 20:45:56',NULL,'2025-06-29 13:36:31'),(172,43,15,NULL,'PREPARING',43.40,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-29 16:42:16',NULL,NULL),(173,43,15,NULL,'PREPARING',43.40,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-29 16:42:26',NULL,NULL),(174,7,15,NULL,'READY',147.90,80.00,'CASH','DELIVERY',0.00,NULL,'PENDING','2025-06-30 02:50:06',NULL,NULL),(175,7,15,NULL,'PREPARING',67.90,80.00,'CASH','DELIVERY',NULL,NULL,'PENDING','2025-06-30 02:51:49',NULL,NULL),(176,7,15,NULL,'READY',128.40,80.00,'CASH','DELIVERY',100.00,NULL,'PENDING','2025-06-30 10:27:42',NULL,NULL),(177,43,15,NULL,'PREPARING',45.90,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-06-30 10:34:58',NULL,NULL),(178,43,15,NULL,'DELIVERED',23.00,0.00,'CASH','DINE_IN',NULL,NULL,'PENDING','2025-07-01 15:15:36',NULL,NULL),(179,7,15,9,'DELIVERED',121.40,80.00,'CASH','DELIVERY',0.00,NULL,'PENDING','2025-07-01 18:10:33',NULL,NULL),(180,43,15,NULL,'DELIVERED',35.40,0.00,'DEBIT','DINE_IN',NULL,NULL,'PENDING','2025-07-02 16:30:25',NULL,NULL),(181,43,15,NULL,'DELIVERED',39.90,0.00,'PIX','DINE_IN',NULL,NULL,'PENDING','2025-07-03 12:28:29',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_acrescimo`
--

DROP TABLE IF EXISTS `product_acrescimo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_acrescimo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `acrescimo_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`acrescimo_id`),
  KEY `acrescimo_id` (`acrescimo_id`),
  CONSTRAINT `product_acrescimo_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_acrescimo_ibfk_2` FOREIGN KEY (`acrescimo_id`) REFERENCES `acrescimos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_acrescimo`
--

LOCK TABLES `product_acrescimo` WRITE;
/*!40000 ALTER TABLE `product_acrescimo` DISABLE KEYS */;
INSERT INTO `product_acrescimo` VALUES (1,1,1);
/*!40000 ALTER TABLE `product_acrescimo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_option_groups`
--

DROP TABLE IF EXISTS `product_option_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_option_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_group` (`product_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `product_option_groups_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_option_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `option_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_option_groups`
--

LOCK TABLES `product_option_groups` WRITE;
/*!40000 ALTER TABLE `product_option_groups` DISABLE KEYS */;
INSERT INTO `product_option_groups` VALUES (2,3,3,'2025-05-22 00:34:18'),(3,4,3,'2025-05-22 00:35:01'),(4,4,4,'2025-05-22 00:35:01'),(16,5,3,'2025-07-01 15:21:06'),(20,2,2,'2025-07-02 16:24:19'),(21,2,3,'2025-07-02 16:24:19'),(22,2,4,'2025-07-02 16:24:19');
/*!40000 ALTER TABLE `product_option_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `establishment_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_products_users` (`establishment_id`),
  KEY `fk_products_categories` (`category_id`),
  CONSTRAINT `fk_products_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_products_users` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`establishment_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'x burguer','e',22.00,'',3,1,'2025-05-18 21:22:25'),(2,'Oba Duplo','2 hamburgueres artesanais (carne, frango ou linguiça), alface, queijo cheddar e maionese.',30.90,'https://res.cloudinary.com/dwdwj5cee/image/upload/v1751473459/painelquick/ctlfrhnfgxhwrl0mnvwc.jpg',730,15,'2025-05-19 15:32:58'),(3,'Oba Salada','1 hamburguer artesanal, alface, queijo cheddar, milho, cenoura, tomate e maionese\r\n\r\n',22.00,'/uploads/1750773997190-795321097-2771401.png',727,15,'2025-05-22 00:34:12'),(4,'Oba Triplo','3 hamburgueres artesanais (1 de carne, 1 de frango e 1 de linguiça), alface, queijo cheddar, milho, catupiry e maionese.\r\nOBSERVAÇÃO: Substituir os hambúrgueres de frango/linguiça por carne bovina terá uma alteração no valor, selecione a opção desejada abaixo',38.90,'/uploads/1750820958290-931494498-china.png',727,15,'2025-05-22 00:34:50'),(5,'Bauru','Maionese, ketchup, presunto, queijo mussarela, batata palha, tomate.\r\n\r\n',12.90,'/uploads/1751383266897-681028807-Screenshot 2025-06-29 052606.png',729,15,'2025-05-22 00:35:26'),(6,'Coca-Cola','Refrigerante de cola',5.00,'',3,1,'2025-05-26 12:21:49'),(7,'Suco de Laranja','Suco natural de laranja',6.50,'',1,1,'2025-05-26 12:21:49'),(8,'Água Mineral','Água mineral sem gás',3.00,'',1,1,'2025-05-26 12:21:49'),(9,'Hambúrguer','Hambúrguer com queijo e bacon',15.00,'',2,1,'2025-05-26 12:21:49'),(10,'Sanduíche Natural','Sanduíche de frango com salada',12.00,'',2,1,'2025-05-26 12:21:49'),(11,'Pastel de Carne','Pastel recheado com carne moída',7.00,'',2,1,'2025-05-26 12:21:49'),(12,'Bolo de Chocolate','Bolo de chocolate com cobertura',8.00,'',3,1,'2025-05-26 12:21:49'),(13,'Sorvete','Sorvete de creme',5.50,'',3,1,'2025-05-26 12:21:49'),(14,'Pudim','Pudim de leite condensado',6.00,'',3,1,'2025-05-26 12:21:49'),(15,'Lasanha','Lasanha à bolonhesa',20.00,'',4,1,'2025-05-26 12:21:49'),(16,'Frango Grelhado','Frango grelhado com legumes',18.00,'',4,1,'2025-05-26 12:21:49'),(17,'Peixe Assado','Peixe assado com batatas',22.00,'',4,1,'2025-05-26 12:21:49'),(18,'Salada Caesar','Salada Caesar com frango',14.00,'',5,1,'2025-05-26 12:21:49'),(19,'Salada Grega','Salada com queijo feta e azeitonas',13.00,'',5,1,'2025-05-26 12:21:49'),(20,'Salada de Frutas','Salada de frutas frescas',10.00,'',5,1,'2025-05-26 12:21:49'),(21,'Refrigerante','Refrigerante de limão',5.00,'',1,1,'2025-05-26 12:21:49'),(22,'Café','Café expresso',4.00,'',1,1,'2025-05-26 12:21:49'),(23,'Chá Gelado','Chá gelado de pêssego',5.50,'',1,1,'2025-05-26 12:21:49'),(24,'Pizza Margherita','Pizza com molho de tomate e queijo',25.00,'',4,1,'2025-05-26 12:21:49'),(25,'Pizza Calabresa','Pizza com calabresa e cebola',28.00,'',4,1,'2025-05-26 12:21:49'),(26,'Pizza Quatro Queijos','Pizza com quatro tipos de queijo',30.00,'',4,1,'2025-05-26 12:21:49'),(27,'Torta de Limão','Torta de limão com merengue',7.50,'',3,1,'2025-05-26 12:21:49'),(28,'Brownie','Brownie de chocolate com nozes',6.50,'',3,1,'2025-05-26 12:21:49'),(29,'Milkshake','Milkshake de morango',8.00,'',3,1,'2025-05-26 12:21:49'),(30,'Espaguete','Espaguete à carbonara',18.00,'',4,1,'2025-05-26 12:21:49'),(31,'Risoto','Risoto de cogumelos',20.00,'',4,1,'2025-05-26 12:21:49'),(32,'Filé Mignon','Filé mignon ao molho madeira',35.00,'',4,1,'2025-05-26 12:21:49'),(33,'Salada Caprese','Salada com tomate, mussarela e manjericão',12.00,'',5,1,'2025-05-26 12:21:49'),(34,'Salada de Atum','Salada com atum e legumes',15.00,'',5,1,'2025-05-26 12:21:49'),(35,'VITOR Santos','hsjj',40.00,'',1,15,'2025-06-01 12:07:34'),(37,'teu cu','',23.00,'',4,1,'2025-06-05 23:12:34'),(38,'VITOR MANOEL DOS SANTOS','tegy',345.00,NULL,729,15,'2025-06-19 22:55:50');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `estabelecimento_id` int(11) NOT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `estabelecimento_id` (`estabelecimento_id`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Coca-Cola 350ml','Refrigerante Coca-Cola lata',5.00,1,1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(2,'Suco de Laranja','Suco natural de laranja 300ml',8.00,1,1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(3,'X-Burger','Hambúrguer, queijo, alface, tomate e maionese',15.00,2,1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(4,'X-Bacon','Hambúrguer, queijo, bacon, alface, tomate e maionese',18.00,2,1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(5,'Batata Frita','Porção de batata frita crocante',12.00,3,1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08'),(6,'Mussarela','Porção de mussarela empanada',15.00,3,1,'ativo','2025-05-29 04:08:08','2025-05-29 04:08:08');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform_fee` decimal(5,2) DEFAULT NULL,
  `delivery_fee` decimal(5,2) DEFAULT NULL,
  `min_order_value` decimal(7,2) DEFAULT NULL,
  `max_delivery_distance` decimal(7,2) DEFAULT NULL,
  `support_email` varchar(255) DEFAULT NULL,
  `support_phone` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,0.00,0.00,0.00,0.00,'','');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('CUSTOMER','ESTABLISHMENT','DELIVERY') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `cpfCnpj` varchar(18) DEFAULT NULL,
  `address` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'VITOR MANOEL DOS SANTOS','manoelvitor253@gmail.com','$2y$10$wGjgNxVMP4ePVviO3YkSDOwa7cnSS3yEOtojZGSUnUt7zCD7HvWK.','ESTABLISHMENT',NULL,NULL,'JOÃO BATISTA DE SOUZA, 95'),(2,'VITOR MANOEL DOS SANTOS','','$2y$10$iFHsmKP8HGMkHGzD/tH3duh7ysItSf5k.aeOMVgtjLDcvsBQstPFG','CUSTOMER','(17) 99128-8208',NULL,'Rua Rufino Barbosa'),(7,'VITOR MANOEL DOS SANTOS','cliente17991288208@clientedelivery.com','$2y$10$5g2xXE9tSKrWb4vvdddbouXb4fxORHllLaLrUUQ2qwhO0y7PzZ6x6','CUSTOMER','17991288208',NULL,'teste1234'),(8,'x burguer','entregafor@tanamao.com','$2y$10$T7Sb/3BFkMHvDYe6i/D8SOsR6uR64aQoRwZTkaEM/cr2d3YaNH8Ny','DELIVERY',NULL,NULL,NULL),(9,'Vítor entrega','vitorapps4@gmail.com','$2a$12$Hy.M.npRkFbiTkRBsZXf/e0N73vvVyCrI2a9MuLyEWt0sS6nVHJfC','DELIVERY','17987659876',NULL,NULL),(10,'Pizzaria Bella Napoli','bella.napoli@teste.com','$2y$10$abcdefghijklmnopqrstuv','ESTABLISHMENT',NULL,NULL,'Rua das Pizzas, 123'),(11,'Hamburgueria Big Burger','big.burger@teste.com','$2y$10$abcdefghijklmnopqrstuv','ESTABLISHMENT',NULL,NULL,'Avenida dos Hambúrgueres, 456'),(12,'Comida Japonesa Sakura','sakura@teste.com','$2y$10$abcdefghijklmnopqrstuv','ESTABLISHMENT',NULL,NULL,'Rua do Sushi, 789'),(13,'Doceria Sweet Dreams','sweet.dreams@teste.com','$2y$10$abcdefghijklmnopqrstuv','ESTABLISHMENT',NULL,NULL,'Praça das Sobremesas, 321'),(14,'Restaurante Sabor Caseiro','sabor.caseiro@teste.com','$2y$10$abcdefghijklmnopqrstuv','ESTABLISHMENT',NULL,NULL,'Rua da Comida Caseira, 654'),(15,'Thiffany Flayra Fernandes dos Santos','obahotdog@gmail.com','$2y$10$HTwfFEK8atILgULkdoQPVeIIWsZScPAtbiMniy4A8v9veu4S48Qn.','ESTABLISHMENT',NULL,NULL,'R. João Batista de Souza - Santo Antônio do Aracanguá, SP, 16130-000, Brasil'),(19,'VITOR MANOEL DOS SANTOS','cli17997548917@fake.com','$2y$10$fDUESo.vUljZKgi7rKbvf.N8dZqO5NVZB7vIuTh/9Kx8WKNcTBOmq','CUSTOMER','17997548917',NULL,'Rua Rufino Barbosa'),(20,'VITOR Santos','pirula@gmail.com','$2y$10$eOiDQkLk2Q95mbRnvtYQq.Z4SZ37liCpmXXbZa4E5So9k3Q4nCS5K','CUSTOMER',NULL,NULL,NULL),(21,'Clodoaldo dos Santos','cli18996564808@fake.com','$2y$10$1Cn1xlUXfGOLt0i4Lfuoye5n9dGQsglGRKuj7lxap3T3ArlNWWTbS','CUSTOMER','18996564808',NULL,'jujujuju'),(22,'Paula dentro ','lucasnovais1217@gmail.com','$2y$10$z./oXuEKGIyRIvvbY0ViFegNXhiAXK7aux4Dtme3lmVOBB8LexdTG','DELIVERY',NULL,NULL,NULL),(23,'Paula dentro de tu','cli40028922@fake.com','$2y$10$ARLPkX3BuUV0ZjMGi8inpOPK9mJvtCAxRKg65GCrsTQ6FqrUvYNP.','CUSTOMER','40028922',NULL,'Casa do Tião come cu'),(24,'Vitinho cara de buce','teses@teste.com','$2b$10$i1UxTRUSFsTj2QvPb/rbp.uoe5uVkxYUs6d3DKXnplv2zGTGKUoiC','CUSTOMER','123456789',NULL,'[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":\"Rua das casas do seu lá \",\"isDefault\":true},{\"id\":\"23709874-ffd9-4631-8427-d6ce64b3321b\",\"name\":\"teste\",\"fullAddress\":\"sei la\",\"isDefault\":false}],\"isDefault\":false},{\"id\":\"5aeefc8e-87e9-40f4-9d70-799d3796105c\",\"name\":\"teste\",\"fullAddress\":\"teste\",\"isDefault\":true}],\"isDefault\":true},{\"id\":\"e2918d20-46da-4303-a34c-6ce37e7b459e\",\"name\":\"teste\",\"fullAddress\":\"teste\",\"isDefault\":false}],\"isDefault\":true},{\"id\":\"7194a715-f3e6-4bfb-9ff8-4e5b928b429d\",\"name\":\"teste\",\"fullAddress\":\"teste\",\"isDefault\":false}]'),(25,'VITOR cta','vitor@gmail.com','$2b$10$FJi090YvcmjGNIZAyAe4PuRjNDgL8n9OKLzbGkJJmITpCdaVK9z0O','CUSTOMER','17991288333',NULL,'Rua Rufino Barbosa, Casa'),(26,'vitor2','vitor2@gmail.com','$2b$10$d3TQXr8OY3DzKk/ts9TLseBJn8sbxZIeCI90xdybcOPyks4KX8X.a','CUSTOMER','123456789',NULL,'rua das carmens'),(27,'VITOR MANOEL DOS SANTOS','manoelvitor25333@gmail.com','$2b$10$2Adi3.kpNsElNmJ/NFJuIuLnSr6.YL4mV9uVrrdBoccS1vaw6sg8K','CUSTOMER','17991288208',NULL,'[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":\"[{\\\"id\\\":\\\"1\\\",\\\"name\\\":\\\"Endereço Principal\\\",\\\"fullAddress\\\":\\\"[{\\\\\\\"id\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"Endereço Principal\\\\\\\",\\\\\\\"fullAddress\\\\\\\":\\\\\\\"[{\\\\\\\\\\\\\\\"id\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"Endereço Principal\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"fullAddress\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"[{\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"id\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Endereço Principal\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"fullAddress\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Rua Rufino Barbosa, Casa\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"isDefault\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":true},{\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"id\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"46fdc9d4-c2d2-47ac-8a1c-3107f1b1961d\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"uh\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"fullAddress\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"ji\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"isDefault\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":false}]\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"isDefault\\\\\\\\\\\\\\\":true},{\\\\\\\\\\\\\\\"id\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"028e8556-15cf-4d51-92ca-62ec840b1c0c\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"casa\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"fullAddress\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"teste\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"isDefault\\\\\\\\\\\\\\\":false}]\\\\\\\",\\\\\\\"isDefault\\\\\\\":true}]\\\",\\\"isDefault\\\":true}]\",\"isDefault\":true}]'),(28,'teste','teste@teste12.com','$2b$10$e2qmkzKHpyC1WNYz1Svuqef7ac/wdAY6nsAJitbhyhORJ3dg9Kpc2','CUSTOMER','123456789',NULL,'JOÃO BATISTA DE SOUZA, 95'),(29,'Viado','viado@viado.com','$2b$10$dvPeaMuXWymiw3T9ky5L4eAZ2ylses/XfwvbreDPAu4jQaAtUqbMq','CUSTOMER','123456789',NULL,'Sua casa'),(30,'rrer','teste12@teste.com','$2b$10$4Vwqj7pQuFBvfAfyHdXEWuSzb57Rm1o5XojPqu.bEQ5fWIMYEEcGS','CUSTOMER','7894654654',NULL,'teste12@teste.com'),(31,'tet','teste013@gmail.com','$2b$10$oPq.CgGZESvWxFaUWzLRN./Frxhhs3TscEUxqObL6Um7CMHaEAKca','CUSTOMER','4345',NULL,'fgfdsg'),(32,'viiitorr','teste34@teste.com','$2b$10$sXOQFc5ZNtP.djKyJxK1tudpn92Ya4hModPaLYU4U1L1ybWZ7nyPa','CUSTOMER','1324321432',NULL,'fweeeqw'),(33,'Administrador','admin@pedindoaqui.com','$2b$10$8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM','ESTABLISHMENT',NULL,NULL,NULL),(37,'testevitor','testevitor@gmail.com','$2b$10$7y/cL0065VncCrKniYhZHu4eBJibXw8CBi8I3SGEjKeVWIpPYvOHK','CUSTOMER','432432',NULL,'[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":[{\"id\":\"1\",\"name\":\"Endereço Principal\",\"fullAddress\":\"eretre\",\"isDefault\":true},{\"id\":\"043400a5-b447-41db-b1bf-1eaf766908c4\",\"name\":\"teste 25\",\"fullAddress\":\"alguma coisa\",\"isDefault\":false}],\"isDefault\":true}],\"isDefault\":true},{\"id\":\"7bceb90a-df9e-4cb4-9483-1983d440606f\",\"name\":\"ert\",\"fullAddress\":\"343\",\"isDefault\":false}]'),(38,'edivaldo','cli1891254367@fake.com','$2y$10$hDT1GzH.j9vjLasLxTbp..pq4I8rZ7QYof2OGzpMNglCSkC9WAcOi','CUSTOMER','1891254367',NULL,'Waldemar da Silva 15'),(39,'INK Surmind','cli12345678@fake.com','$2y$10$hcEM/pDoGaGC5ZORTQ8yT.Ee0Vp.Hve80BcSAUmKTmPfLBe6Yb6DW','CUSTOMER','12345678',NULL,'JOÃO BATISTA DE SOUZA, 95'),(40,'joao nbabanba','cli321424@fake.com','$2y$10$byOKS17Ia.Vu8/9.WVPPFup7sD1UcDwoTFznT89DOU7JYVByg2bTO','CUSTOMER','321424',NULL,'rtreert'),(41,'sei la ','teste@teste1223.com','$2b$10$G17NiLkAVGQ6oXiyeAMo4.REttF/VYvO4U9LKr8nwmlW8iIUfIdZ6','CUSTOMER','12312314',NULL,'sdfweewf'),(42,'CONSUMO LOCAL','consumolocal@faker.com','12345678','CUSTOMER','00000000000',NULL,'LOCAL'),(43,'CONSUMO LOCAL','local@faker.com','12345678','CUSTOMER','00000000000',NULL,'LOCAL'),(44,'INK Surmind','teste0122@teste.com','$2a$10$Vln1/9cvgn5mMIfiP9D81e0hQPIxqrj3bqFCCfZ4HAwD.FLRO6C1O','ESTABLISHMENT','17991288203','12664298402',NULL),(45,'Moisés esdras ','m.esdras55221133@gmail.com','$2a$10$.9qtqOoyFFr8gWTCt3sIpeIw6UO436/pZMh5O1Buc/ByWO7nhW.92','ESTABLISHMENT','18996690479','481.865.348-90 ',NULL),(46,'teste1234','teste@teste1234.com','$2a$10$LvBxJn3UzEvPUP9dNa6pPuh.77hrjY7IeAdi3lmYHQDeJ4qwftI3m','ESTABLISHMENT','17991288204','12664298402',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas_pdv`
--

DROP TABLE IF EXISTS `vendas_pdv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas_pdv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estabelecimento_id` int(11) NOT NULL,
  `caixa_id` int(11) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `forma_pagamento` enum('dinheiro','cartao','pix') NOT NULL,
  `status` enum('concluida','cancelada') DEFAULT 'concluida',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `estabelecimento_id` (`estabelecimento_id`),
  KEY `caixa_id` (`caixa_id`),
  CONSTRAINT `vendas_pdv_ibfk_1` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`),
  CONSTRAINT `vendas_pdv_ibfk_2` FOREIGN KEY (`caixa_id`) REFERENCES `caixa_pdv` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas_pdv`
--

LOCK TABLES `vendas_pdv` WRITE;
/*!40000 ALTER TABLE `vendas_pdv` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendas_pdv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `bank_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bank_info`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-03 12:28:23
