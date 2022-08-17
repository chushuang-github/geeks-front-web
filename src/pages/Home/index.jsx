import Bar from "@/components/Bar"
import './index.scss'

const Home = () => {
  return (
    <div className="home">
      <Bar
        style={{ width: '500px', height: '400px' }}
        xData={['vue', 'angular', 'react']}
        sData={[150, 60, 170]}
        title='三大框架满意度' />

      <Bar
        style={{ width: '500px', height: '400px' }}
        xData={['react', 'vue', 'angular']}
        sData={[300, 280, 120]}
        title='三大框架使用度' />
    </div>
  )
}

export default Home