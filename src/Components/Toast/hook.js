import { AiFillWarning } from "react-icons/ai";
import { BsFillCheckCircleFill, BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineError } from "react-icons/md";

const toastHook = {
  success(desc, pos) {
    const MyToast = {
      title: "SUCCESS",
      description: desc,
      position: pos ? pos : "bottom-right",
      backgroundColor: "#5cb85c",
      icon: <BsFillCheckCircleFill />,
    };
    return MyToast;
  },
  error(desc, pos) {
    const MyToast = {
      title: "ERROR",
      description: desc,
      position: pos ? pos : "bottom-right",
      backgroundColor: "#d9534f",
      icon: <MdOutlineError />,
    };
    return MyToast;
  },
  info(desc, pos) {
    const MyToast = {
      title: "INFO",
      description: desc,
      position: pos ? pos : "bottom-right",
      backgroundColor: "#5bc0de",
      icon: <BsFillInfoCircleFill />,
    };
    return MyToast;
  },
  warning(desc, pos) {
    const MyToast = {
      title: "WARNING",
      description: desc,
      backgroundColor: "#f0ad4e",
      position: pos ? pos : "bottom-right",
      icon: <AiFillWarning />,
    };
    return MyToast;
  },
};

export default toastHook;
