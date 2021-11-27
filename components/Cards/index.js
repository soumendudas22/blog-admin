import { RiLoginBoxFill, RiLogoutBoxFill } from "react-icons/ri";
import { MdViewInAr } from "react-icons/md";
import { signIn, signOut, useSession } from 'next-auth/client';
import { SiAddthis } from "react-icons/si";
import { useState } from "react";
import Link from 'next/link';

import Card from "./Card";
import Modal from "../Modal";
import AddEntry from "./../AddEntry";

export default function Cards() {
  const [session, loading] = useSession()
  const [open, setOpen] = useState(false);

  return (<>
    <div className="cards-wrapper">
      {!loading && !session && (
        <Link href='/api/auth/signin'>
          <a
            onClick={e => {
              e.preventDefault()
              signIn('google', { callbackUrl: `${process.env.BASE_URL}/dashboard` })
            }}>
            <Card text='LOGIN'><RiLoginBoxFill color="white" size={30} /></Card>
          </a>
        </Link>
      )}

      {session && (
        <div onClick={() => {
          setOpen(!open);
        }}>
          <Card text='ADD_ENTRY'><SiAddthis color="white" size={30} /></Card>
        </div>
      )}

      {session && (
        <Link href='/api/auth/signout'>
          <a
            onClick={e => {
              e.preventDefault()
              signOut({ callbackUrl: `${process.env.BASE_URL}` })
            }}>
            <Card text='LOGOUT'><RiLogoutBoxFill color="white" size={30} /></Card>
          </a>
        </Link>
      )}
      <Card text='PREVIEW'><MdViewInAr color="white" size={30} /></Card>
    </div>

    <Modal isOpen={open} setOpen={setOpen}>
      <AddEntry />
    </Modal>
  </>);
}