import { useMutation, useQuery } from "@tanstack/react-query"
import { callService } from "../services/call.service"



const useGetInfoCall = ({ call_id }: { call_id: string }) => {

    const getInfoCall = useQuery({
        queryKey: ['get-call-info', call_id],
        queryFn: () => {
            return callService.getCallInfo({ call_id })
        },
        enabled: !!call_id
    })
    return getInfoCall

}

const useCreatefoCall = () => {

    const createInfoCall = useMutation({
        mutationKey: ['create-call-info', ],
        mutationFn: ({ call_caller_id, call_receiver_id, onwer_id }: {
            call_caller_id: string,
            call_receiver_id: string,
            onwer_id: string
        }) => {
            return callService.createCallInfo({ call_caller_id, call_receiver_id, onwer_id })
        }
    })
    return createInfoCall

}



export { useGetInfoCall, useCreatefoCall }