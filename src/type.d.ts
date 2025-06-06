export namespace Account {
    type UserGender = "MALE" | "FEMALE" | "OTHER";
   
    type UserRole = "USER" | "ADMIN" | "GUEST";

    type UserAvatar = ClondinaryType & {
        date: Date;
    };

    export type TUser = {
        _id: string;
        user_email: string;
        user_first_name: string;
        user_last_name: string;
        user_password: string;
        user_birthday: Date;
        user_gender: UserGender;
        user_roles: UserRole;
        user_avatar_system: string;
        user_avatar_current: string;
        user_atlas: string;
        user_password_state: boolean;
        user_auth: "email" | "oAuth";
        user_avater_used: UserAvatar[];
        user_create_password: boolean;
    };

}
type CustomRequest = Omit<RequestInit, "method"> & {
      baseUrl?: string;
      pathName?: string;
};

type MessageResponse = { message: string };

type TokenNextSync = {
      access_token: string;
      refresh_token: string;
      client_id: string;
      expireToken: string;
      code_verify_token: string;
};
