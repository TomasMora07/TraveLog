use travelog;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) DEFAULT NULL,
  apellido VARCHAR(60) DEFAULT NULL,
  email VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL,
  admin TINYINT(1) DEFAULT NULL,
  confirmado TINYINT(1) DEFAULT NULL,
  token VARCHAR(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Crear tabla de países
CREATE TABLE paises (
  id CHAR(2) PRIMARY KEY, -- Usar código de dos letras para los países (e.g., 'ES', 'FR')
  title VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Crear tabla de recuerdos
CREATE TABLE recuerdos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  fecha DATE NOT NULL,
  imagen VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Crear tabla intermedia para usuarios, países y recuerdos
CREATE TABLE usuarios_paises_recuerdos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_pais CHAR(2) NOT NULL,
  id_recuerdo INT DEFAULT NULL, -- Permitir NULL para relaciones sin recuerdos
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_pais) REFERENCES paises(id) ON DELETE CASCADE,
  FOREIGN KEY (id_recuerdo) REFERENCES recuerdos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;