const env = import.meta.env

const HomePage = (): JSX.Element => {
  return (
    <div>
      <div>{APP_VERSION && APP_VERSION}</div>
      <div>{env && 'DEVELOPMENT'}</div>
    </div>
  )
}

export default HomePage
