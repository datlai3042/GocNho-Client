'use client'
import React from 'react'
import { useGetAllUser } from '../../User/hooks/useGetAllUser'
import { UserType } from '../../User/index.type'
import { Phone } from 'lucide-react'
import ButtonCall from '../../Streaming/components/Buttons/ButtonCall'


const UserBlock = ({ user }: { user: UserType }) => {

    return <div className='rounded-lg min-h-[10rem] w-[30rem] flex items-center p-[1rem] gap-[2rem]' style={{ boxShadow: '1px 1px 3px 3px rgb(8 6 101)' }}>

        <div className='w-[6rem] h-[6rem] rounded-full bg-red-700'></div>

        <span>{user?.user_email}</span>
        <ButtonCall userEvent={user} />
    </div>
}

const ShowListUsers = () => {
    const hookUserList = useGetAllUser({
        config: {

        }
    })
    console.log({ hookUserList })
    return (
        <div className='flex flex-wrap gap-[2rem]'>

            {!hookUserList?.isPending && hookUserList?.data?.metadata?.users?.map((user) => <UserBlock user={user} key={user._id} />)}
        </div>
    )
}

export default ShowListUsers