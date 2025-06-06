import { useQuery } from "@tanstack/react-query"
import userService from "../services"
export type TUseGetAllUser = {
    config: {
        excludeMe?: boolean
        fields?: string[]
    }
}
const useGetAllUser = (props: TUseGetAllUser) => {
    return useQuery({
        queryKey: ['/get-all-list'],
        queryFn: () => userService.getAllListUsers({config: props.config})
    })

}


export { useGetAllUser }