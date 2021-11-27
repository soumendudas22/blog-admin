import { IoMedicalSharp } from "react-icons/io5";
import Cards from "./../Cards";
import Link from "next/link";

function Navbar() {
  return (
    <nav className='header' id="navbar-header">
      <Link href={'/dashboard'} passHref>
        <div className="brand">
          <span><IoMedicalSharp className='star' color='rgb(142, 233, 236)' /> BLOGPOST</span>
        </div>
      </Link>
      <div>
        <Cards />
      </div>
    </nav>
  )
}

export default Navbar
