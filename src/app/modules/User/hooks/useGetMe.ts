import { useQuery } from "@tanstack/react-query"
import userService from "../services"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { onFetchUser } from "@/lib/Redux/auth.slice"

const useGetMe = () => {
    const dispatch = useDispatch()
    const getMe = useQuery({
        queryKey: ['get-me'],
        queryFn: () => userService.getMe(),

    })


    useEffect(() => {
        if (!getMe.isPending && getMe.isSuccess) {
            const user = getMe.data.metadata.user
            dispatch(onFetchUser({ user }))
        }
    }, [getMe.isPending, getMe.isSuccess])

    return { getMe }
}



export { useGetMe }