export interface ILoginResponse {
  msg: string;
  usuario: IUsuario;
  token: string;
}

export interface IUsuario {
  id_user: number;
  per_id: number;
  rol_id: number;
  usu_contra: string;
  usu_verif: string;
  usu_estado: string;
  usu_email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ipersona {
  per_id: number;
  per_cel: string;
  per_nombres: string;
  per_apellidos: string;
  per_estado: string;
  createdAt: string;
  updatedAt: string;
}