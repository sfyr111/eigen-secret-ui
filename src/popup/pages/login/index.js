import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'
import imgLogo from '@/content/images/icon.png'
import './login.scss'

function Login() {
  const navigate = useNavigate()

  const login = () => {
  	navigate('/home')
  }

  return (
    <div className="sign-page">
      <div className="sign-title">
        请求签名
      </div>
      <Button type="primary" onClick={login}>登录</Button>
    </div>
  )
}

export default Login