import Header from "./components/Header"
import DiaryList from "./components/DiaryList"

const App = () => {
  const headerName = "Add new entry"
  
  return(
    <div>
      <Header 
        header={headerName}
      />
      <DiaryList />
    </div>
  )
}

export default App