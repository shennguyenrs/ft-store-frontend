import {
  Avatar,
  Divider,
  Menu,
  Modal,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { NextLink } from "@mantine/next";
import { forwardRef, ReactElement, useContext, useState } from "react";
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoPerson,
  IoPersonAddOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoStarOutline,
} from "react-icons/io5";
import { Login, Register } from "../../components/forms";
import { UserContext, USERCTX, USER_TYPE } from "../../contexts/users";
import { STRAPI_BK } from "../../libs/constants";
import { createdUser } from "../../libs/noti";
import useStyles from "./MenuButton.styles";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  avatar?: string;
  name?: string;
}

const userPage = "/users";

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ avatar, name, ...others }: UserButtonProps, ref) => {
    const [err, setErr] = useState<boolean>(false);
    const { classes } = useStyles();

    const avaStyles = {
      root: classes.avatarRoot,
      placeholder: classes.avatarPlaceholder,
    };

    const ImageAva = () => (
      <Avatar
        classNames={avaStyles}
        src={`${STRAPI_BK}/${avatar}`}
        alt="user-image-avatar"
        onError={() => setErr(true)}
      />
    );

    const NameAva = () => (
      <Avatar alt="user-name-avatar" classNames={avaStyles}>
        {name?.slice(0, 2).toUpperCase()}
      </Avatar>
    );

    const NoAva = () => (
      <Avatar alt="anonymous-user-avatar" classNames={avaStyles}>
        <IoPerson />
      </Avatar>
    );

    return (
      <UnstyledButton ref={ref} className="button-animation" {...others}>
        {(avatar && !err && <ImageAva />) || (name && <NameAva />) || <NoAva />}
      </UnstyledButton>
    );
  }
);

UserButton.displayName = "UserButton";

export default function MenuButton(): ReactElement {
  const { classes, cx } = useStyles();
  const { user, userType, logout } = useContext<USERCTX>(UserContext);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const modals = useModals();

  const handleCloseRegister = () => {
    setOpenRegister(false);

    // Fire noti
    createdUser();
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);

    // Fire noti
    loginMailSentModal();
  };

  // Modals
  const RegisterModal = () => (
    <Modal
      title="Register new account"
      opened={openRegister}
      onClose={() => setOpenRegister(false)}
      centered
    >
      <Register closeForm={handleCloseRegister} />
    </Modal>
  );

  const LoginModal = () => (
    <Modal
      title="Login"
      opened={openLogin}
      onClose={() => setOpenLogin(false)}
      centered
    >
      <Login closeForm={handleCloseLogin} />
    </Modal>
  );

  const loginMailSentModal = () => {
    const id = modals.openModal({
      title: "📧 Your email has just been sent",
      children: (
        <div>
          <p>
            We sent you an email with a link to login to your account. Please
            check your email inbox (or spam) and click on the link to login.
          </p>
          <UnstyledButton
            className={cx(classes.modalBtn, "button-animation")}
            onClick={() => modals.closeModal(id)}
          >
            Close
          </UnstyledButton>
        </div>
      ),
      centered: true,
    });
  };

  // Menus
  const LoginedMenu = () => (
    <>
      <Menu.Label>Settings</Menu.Label>
      <Menu.Item
        icon={<IoPersonOutline />}
        component={NextLink}
        href={`${userPage}/${user?.id}`}
      >
        User information
      </Menu.Item>
      <Menu.Item
        icon={<IoReceiptOutline />}
        component={NextLink}
        href={`${userPage}/${user?.id}`}
      >
        Previous orders
      </Menu.Item>
      <Menu.Item
        icon={<IoStarOutline />}
        component={NextLink}
        href={`${userPage}/${user?.id}`}
      >
        Favorite products
      </Menu.Item>

      <Divider />

      <Menu.Item icon={<IoLogOutOutline />} onClick={logout}>
        Logout
      </Menu.Item>
    </>
  );

  const UnloginedMenu = () => (
    <>
      <Menu.Item
        icon={<IoPersonAddOutline />}
        onClick={() => setOpenRegister(true)}
      >
        Register
      </Menu.Item>
      <Menu.Item icon={<IoLogInOutline />} onClick={() => setOpenLogin(true)}>
        Login
      </Menu.Item>
    </>
  );

  return (
    <>
      <LoginModal />
      <RegisterModal />
      <Tooltip
        classNames={{
          body: "tooltip-body",
        }}
        label="Menu"
        position="bottom"
        placement="center"
      >
        <Menu
          classNames={{
            root: classes.menuRoot,
            body: classes.menuBody,
            item: classes.menuItem,
            itemHovered: classes.menuItemHovered,
          }}
          shadow="xs"
          control={<UserButton avatar={user?.avatar} name={user?.username} />}
          transition="rotate-right"
          transitionDuration={400}
          transitionTimingFunction="ease"
        >
          {userType === USER_TYPE.AUTH ? <LoginedMenu /> : <UnloginedMenu />}
        </Menu>
      </Tooltip>
    </>
  );
}
