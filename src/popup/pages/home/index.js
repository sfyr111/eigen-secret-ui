import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'
import imgLogo from '@/content/images/icon.png'
import './home.css'

function Home() {
	const navigate = useNavigate()

	return (
       <div className="home-page">
         <div className="logo-box"><img src={imgLogo} alt="" className="logo" /></div>
         <Button type="primary" onClick={()=>{navigate('/login')}}>返回</Button>
       </div>
	)
}

export default Home