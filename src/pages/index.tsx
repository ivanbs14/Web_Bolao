//interface HomeProps {
//  count: number;
//}

import Image from "next/image"
import appPreviewImg from '../assets/app_nlw_copa_preview.png'
import LogoImg from '../assets/logo.svg'
import UsersAvatar from '../assets/users_avatares_exemplo.png'
import IconCheckImg from '../assets/icon_check.svg';
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  //prevenindo evento de atualizaçao da pagina
  async function createPool(event: FormEvent) {
    event.preventDefault()
 

  try {
    const response = await api.post('/pools', {
      title: poolTitle,
    });
    
    const { code } = response.data
  
    await navigator.clipboard.writeText(code)

    alert('Bolão criado com sucesso, o codigo foi copiado para a área de transferência!')

    setPoolTitle('')

  }
  
  catch (err) {
    console.log(err)
    alert('Falha ao criar o bolão, tente novamente!')
  }
}
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={LogoImg} alt="imagem da logo nlw" />

        <h1 className="mt-14 text-white text-5xl leading-tight font-bold">
          Crie seu própio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={UsersAvatar} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span>
            pessoas ja estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input className="flex-1 px-6 py-4 rounded bg-slate-800 border border-gray-600 text-sm text-gray-100"
          type="text" 
          required placeholder="Qual o nome do seu bolão?"
          onChange={event => setPoolTitle(event.target.value)}
          value={poolTitle}
          />

          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          type="submit">Criar meu bolão</button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único 
          que poderá usar para convidar outras pessoas 🚀
          </p>
      
        <div className="mt-5 pt-5 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={IconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />
          
          <div className="flex items-center gap-6">
            <Image src={IconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg}
        alt="imagem dois celulares com previem do app"
        quality={100}
      />
    </div>
  )
}

// Requisiçao de chamadas para o banco de dados

export const getServerSideProps = async () => {
  const [
    poolCountResponse, 
    guessCountResponse,
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')

  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}


