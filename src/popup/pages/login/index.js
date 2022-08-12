import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'
import imgLogo from '@/content/images/icon.png'
import './login.scss'
// import ConfluxPortalInpageProvider from '@yqrashawn/conflux-portal-inpage-provider'
// console.log(ConfluxPortalInpageProvider)

function Login() {
  const navigate = useNavigate()

  const login = () => {
  	navigate('/home')
  }

  return (
    <div className="sign-page">
      <div className="sign-title">
        request sign
      </div>
      <div className="confirm-modal">
        <div className="confirm-modal-wraper">
          <div className="top-header">
            <div className="user-address"><i className="user"></i>Account1</div>
            <div className="net"><i className="cicrl"></i>banlance: 21.106137</div>
          </div>
          <div className="approve-info">
            <div className="host"><i></i><span>http://secret.eigen.cash</span></div>
            <div className="info">
              <div className="token-address-wrapper">
                <span>Signing:</span>
              </div>
            </div>
          </div>
          <div className="gas-info-wrapper">
            <div className="gas-info-wrapper-inner">
              <div className="sign-title">Message:</div>
              <div className="sign-msg">bjsdoiiiuoidufsdfinssd=sdwe</div>
            </div>
          </div>
          <div className="button-content">
            <Button className="button-default" onClick={login}>Cancel</Button>
            <Button className="button-primary" onClick={login}>Sign</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login