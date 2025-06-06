import http from "@/lib/Http"
import { UserType } from "../index.type"
import { TUseGetAllUser } from "../hooks/useGetAllUser"

const path = '/v1/api/users'
const renderSubPath = (pathSub: string) => path + '/' + pathSub

class UserService {
    async getAllListUsers(args: TUseGetAllUser) {
        return http.get<{users: UserType[]}>(renderSubPath('get-all-list'), {})
    }
    async getMe() {
        return http.get<{user: UserType}>(renderSubPath('get-me'))
    }
}

const userService = new UserService()

export default userService