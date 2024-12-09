import Logo from '../assets/LogoBlack.svg';

export function Loading() {
  return (
    <div className='h-full flex flex-col justify-center items-center gap-8 opacity-50'>
      <div className='[transform:scale(2)]'>
        <Logo />
      </div>
    </div>
  );
}
