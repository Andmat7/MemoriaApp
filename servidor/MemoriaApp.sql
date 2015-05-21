-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 24-04-2015 a las 22:37:11
-- Versión del servidor: 5.5.43-0ubuntu0.14.04.1
-- Versión de PHP: 5.5.9-1ubuntu4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `MemoriaApp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `books`
--

CREATE TABLE IF NOT EXISTS `books` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `ISBN` varchar(15) COLLATE utf8_bin DEFAULT NULL,
  `title` varchar(200) COLLATE utf8_bin NOT NULL,
  `description` varchar(400) COLLATE utf8_bin NOT NULL,
  `img` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `epub` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `tags` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  `url` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  `category` int(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `username` varchar(10) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`) VALUES
(1, 'admin', '3614f7b8bf42dbb37b040c9387ddc1f0');


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dictionary`
--

CREATE TABLE IF NOT EXISTS `dictionary` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `palabra` varchar(300) COLLATE utf8_bin NOT NULL,
  `definicion` varchar(300) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `dictionary`
--

INSERT INTO `dictionary` (`palabra`, `definicion`) VALUES
('Narcotraficantes', 'Persona que se dedica al comercio ilícito de drogas tóxicas en grandes cantidades.');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
