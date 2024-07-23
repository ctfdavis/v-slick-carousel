import ElementPlus from 'element-plus'
import 'prismjs'
import 'prismjs/components/prism-typescript'
import 'element-plus/dist/index.css'
import '@lib/styles/theme.scss'
import '../src/prism-tomorrow-night.css'

export { onCreateApp }

const onCreateApp = (pageContext) => {
  const { app } = pageContext
  app.use(ElementPlus)
}
