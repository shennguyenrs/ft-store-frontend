import { Modal } from "@mantine/core";
import type { ReactElement } from "react";
import { useContext, useState } from "react";
import { IoLocation } from "react-icons/io5";
import { DeliveryInfoForm } from "../../components/forms";
import { UserContext, USERCTX } from "../../contexts/users";
import useDeliInfo from "../../hooks/useDeliInfo";
import HeaderButton from "./HeaderButton";
import useStyles from "./HeaderNav.styles";

export default function ChangeAddressButton(): ReactElement {
  const [openAddressModal, setOpenAddressModal] = useState<boolean>(false);
  const { classes } = useStyles();
  const { user } = useContext<USERCTX>(UserContext);
  const info = useDeliInfo();

  const QuickAddressModal = () => (
    <Modal
      title="Quick update address"
      opened={openAddressModal}
      onClose={() => setOpenAddressModal(false)}
      centered
    >
      <DeliveryInfoForm initialValues={info} />
    </Modal>
  );

  return (
    <>
      <QuickAddressModal />
      <HeaderButton
        label="Change location"
        aria-label="change-location-button"
        clickFn={() => setOpenAddressModal(true)}
      >
        <IoLocation />
        <p className={classes.badgeText}>
          {user?.city && user?.zipcode
            ? `${user.city}, ${user.zipcode}`
            : "Nowhere"}
        </p>
      </HeaderButton>
    </>
  );
}
