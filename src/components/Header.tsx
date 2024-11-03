export default function Header() {
  return (
    <div className='header'>
      <div className='logo'>
        {/* FIXME: use react router Link */}
        <a href='/'>
          <img src='src/assets/logo_white.svg' />
        </a>
      </div>
    </div>
  );
}
