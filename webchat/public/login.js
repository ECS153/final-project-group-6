// function MainPage() {
//   return (
//     <Main/>
//   );
// }
//
// function Main() {
//   return (
//     <main>
//       <LeftSide/>
//       <RightSide/>
//     </main>
//   );
// }
//
// function LeftSide() {
//   return (
//       <div className = "LeftSide">
//         <div className = "Div1">
//         <div className = "Welcome"> Welcome to Lango!</div>
//         <div className = "Subtitle"> Customize your vocabulary</div>
//       </div>
//       </div>
//   );
// }
//
// function RightSide() {
//   return (
//      <div className = "RightSide">
//       <div className = "Div2">
//          <ButtonSave/>
//       </div>
//      </div>
//   );
// }
//
// function ButtonSave() {
//   return (
//     <button className="my-button">
//       Login with Google
//     </button>
// );
// }


const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

ReactDOM.render(
  // <MainPage/>,
  element,
  document.getElementById('login')
);
