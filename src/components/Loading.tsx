import Logo from '../assets/LogoBlack.svg';

export function Loading() {
  return (
    <div className='[height:calc(100vh-72px)] flex flex-col justify-center items-center gap-8 animate-pulse'>
      <div className='[transform:scale(2)] [transform-origin:center_center]'>
        <Logo />
      </div>
    </div>
  );
}
