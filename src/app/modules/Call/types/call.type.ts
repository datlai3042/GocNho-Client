export type TCallSchema = {
  call_caller_id: string,
  call_receiver_id:string
  call_status: 'ACCPET' | 'REJECT' | 'UNANSWERED' | 'CREATE' | 'COMPLETE'
  call_type: 'VIDEO' | 'SOUND'
  call_active: boolean
  call_time: Date,
}