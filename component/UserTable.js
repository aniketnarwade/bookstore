import { DeleteIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  GridItem,
  Input,
  Button,
  Checkbox,
  IconButton,
  useToast,
  Container,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const UserTable = ({ setHomeUser }) => {
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, email, phone } = formData;
      if (!name || !email || !phone) {
        let nameerr = !name ? "Name , " : "";
        let emailerr = !email ? "Email , " : "";
        let phoneerr = !phone ? "Phone Number , " : "";
        toast({
          title: `Please add ${nameerr} ${emailerr} ${phoneerr} `,
          status: "error",
          isClosable: true,
        });
        return; // Stop the submission
      }
      setSubmitting(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
        }),
      });

      if (response.status === 200) {
        setSubmitting(false);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
        });
        toast({
          title: `User Created Successfully`,
          status: "success",
          isClosable: true,
        });
        fetchData();
      } else {
        toast({
          title: `User Not Created Successfully`,
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = (user) => {
    setSelectedUser((prevSelectedUser) =>
      prevSelectedUser?._id === user._id ? null : user
    );
    setHomeUser((prevHomeUser) =>
      prevHomeUser?._id === user._id ? null : user
    );
  };

  const deleteUser = async (userId) => {
    try {
      const url = `https://bookstore-nu-ten.vercel.app/api/user?id=${encodeURIComponent(
        userId
      )}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        toast({
          title: `User Deleted Successfully`,
          status: "error",
          isClosable: true,
        });
        fetchData();
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen main mt-4">
        <form
          className="w-full max-w-md bg-white p-8 rounded shadow-lg"
          onSubmit={formSubmit}
        >
          <h2 className="text-2xl font-bold mb-6">User Form</h2>
          {submitted ? (
            <>
              <p className="text-green-500 mb-6">
                User submitted successfully!
              </p>
              <p className=" mb-6">
                Submit another User?
                <button
                  onClick={() => {
                    setSubmitted(false);
                  }}
                  className=" btn-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Click here{" "}
                </button>{" "}
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChangeForm}
                  className="inputBox border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <input
                  type="tel"
                  id="phone"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChangeForm}
                  className="inputBox border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChangeForm}
                  className="inputBox border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className=" btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </>
          )}
        </form>
      </div>

      <Box overflowX="auto">
        <h1
          className="bg-red-400"
          style={{ textAlign: "center", color: "white", margin: "20px 0px" }}
        >
          User Table
        </h1>
        <Table
          style={{ tableLayout: "fixed" }}
          width={"100%"}
          variant="striped"
        >
          <Thead>
            <Tr>
              <Th width={"30%"}>Name</Th>
              <Th width={"45%"}>Email</Th>
              <Th width={"25%"}>Phone</Th>
              <Th width={"20%"}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userData?.map((user) => (
              <Tr
                key={user.id}
                color={user._id === selectedUser?._id ? "red.500" : ""}
              >
                <Td>
                  <Checkbox
                    isChecked={user._id === selectedUser?._id}
                    onChange={() => handleCheck(user)}
                    size={{ base: "md", md: "lg" }}
                    colorScheme="telegram"
                  ></Checkbox>
                  <p>{user.name}</p>
                </Td>
                <Td>{user.email}</Td>
                <Td>{user.phone}</Td>
                <Td>
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => deleteUser(user._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default UserTable;
