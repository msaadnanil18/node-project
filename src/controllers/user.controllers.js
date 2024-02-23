import { asyncHandler } from "../utills/asyncHandler.js";
import { User } from "../schema/googleAuth.js";

const loginUserUpdate = asyncHandler(async (req, res) => {
  const { name, email, given_name, email_verified, picture } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      given_name,
      email_verified,
      picture,
    });
  }

  const userId = user._id;

  return res.status(201).json({ _id: userId, ...user._doc });
});

const logiUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// const updatePassword = asyncHandler(async (req, res) => {
//   const userId = req.params.userId;
//   const { fieldPassword, password } = req.body;
//   try {
//     const user = await User.findByIdAndUpdate(
//       userId,
//       {
//         $push: {
//           passwordHistory: {
//             fieldPassword: fieldPassword,
//             password: password,
//           },
//         },
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     console.log("Updated user password history:", user);
//     res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully", user });
//   } catch (error) {
//     console.error("Error updating password history:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { fieldPassword, password } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingPasswordEntryIndex = user.passwordHistory.findIndex(
      (entry) => entry.fieldPassword === fieldPassword
    );

    if (existingPasswordEntryIndex !== -1) {
      user.passwordHistory[existingPasswordEntryIndex].password = password;
    } else {
      user.passwordHistory.push({ fieldPassword, password });
    }

    const updatedUser = await user.save();

    console.log("Updated user password history:", updatedUser);
    res
      .status(200)
      .json({
        success: true,
        message: "Password updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error updating password history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const deletePassword = asyncHandler(async (req, res) => {
  const deleteId = req.params.deleteId;
  const deletedOne = req.params.deletedOne;
  try {
    const user = await User.findById(deleteId);
    if (!user) {
      return res.json({ message: "User not founded" });
    }
    const passwordHistoryIndex = user.passwordHistory.findIndex(
      (history) => String(history._id) === deletedOne
    );
    if (passwordHistoryIndex === -1) {
      return res.status(404).json({ message: "Password history not found" });
    }
    user.passwordHistory.splice(passwordHistoryIndex, 1);
    await user.save();
    return res
      .status(200)
      .json({ message: "Password history deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const editPassword = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const editId = req.params.editId;

  try {
    const user = await User.findById(userId);
    const editPasswordHistoryIndex = user.passwordHistory.findIndex(
      (history) => String(history._id) === editId
    );

    if (editPasswordHistoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Password edit not found",
      });
    }

    const passwordEdit = user.passwordHistory.splice(
      editPasswordHistoryIndex,
      1
    )[0];

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      passwordEdit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export {
  logiUser,
  updatePassword,
  loginUserUpdate,
  deletePassword,
  editPassword,
};
