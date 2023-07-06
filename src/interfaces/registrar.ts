interface IPersona {
  per_id: number;
  per_cel: string;
  per_nombres: string;
  per_apellidos: string;
  per_estado: string;
  updatedAt: string;
  createdAt: string;
}

interface IUsuario {
  id_user: number;
  per_id: number;
  rol_id: number;
  usu_email: string;
  usu_contra: string;
  usu_estado: string;
  updatedAt: string;
  createdAt: string;
}