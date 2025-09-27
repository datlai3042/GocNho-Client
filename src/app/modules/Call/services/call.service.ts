import http from "@/lib/Http"
import { TCallSchema } from "../types/call.type"

const path = '/v1/api/call'
const renderSubPath = (pathSub: string) => path + '/' + pathSub
class CallService {
    async getCallInfo({ call_id }: { call_id: string }) {
        return http.get<{ info: TCallSchema }>(renderSubPath('get-call-info' + '?call_id=' + call_id))
    }

    async createCallInfo({ call_caller_id, call_receiver_id, onwer_id }: {
        call_caller_id: string,
        call_receiver_id: string,
        onwer_id: string
    }) {
        return http.post<{ info: TCallSchema }>(renderSubPath('create-call-info'), { infoCreate: { call_caller_id, call_receiver_id, onwer_id } })
    }
}



const callService = new CallService()
export { callService }