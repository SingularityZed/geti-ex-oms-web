import React, { useState } from "react";
import {UpCircleFilled, UpCircleTwoTone} from '@ant-design/icons';
import styles from './styles.less';
import backimg from '../../static/icon/back_icon.svg'

const DetailSiderBar = (props)=>{
  const {handleReturn} = props
  const [back,setBcak] = useState<boolean>(false)
  const [backTop,setbackTop] =useState<boolean>(false)
  const handleTop = () => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
  return(
    <div className={styles.affix}>
      <div
      onClick={()=> {handleReturn()}}
      style={{marginBottom:'20px'}}
      onFocus={()=>0}
      onMouseOver={()=>setBcak(true)}
      onMouseLeave={()=>setBcak(false)}>
        {back&&<img src={backimg} style={{width:'30px',height:'30px'}} alt=""/>}
        {!back&&<span style={{fontSize:'16px',color:'#fff'}}>返回</span>}
      </div>
      <div
      onClick={handleTop}
       onFocus={()=>0}
       onMouseOver={()=>setbackTop(true)}
       onMouseLeave={()=>setbackTop(false)}>
        {backTop&&<UpCircleTwoTone style={{fontSize:'30px'}} />}
        {!backTop&&<span style={{fontSize:'16px',color:'#fff'}}>置顶</span>}
      </div>
    </div>
  )
}
export default DetailSiderBar;
