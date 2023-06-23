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
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (response.status === 200) {
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
    <Container maxW="100%">
      <form onSubmit={formSubmit}>
        <Grid templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]} gap={6}>
          <GridItem>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChangeForm}
              placeholder="name"
              backgroundColor="white"
              required
              type="text"
            />
          </GridItem>
          <GridItem>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChangeForm}
              placeholder="phone"
              backgroundColor="white"
              required
              type="number"
            />
          </GridItem>
          <GridItem>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChangeForm}
              placeholder="email"
              backgroundColor="white"
              required
              type="email"
            />
          </GridItem>
          <GridItem>
            <Button colorScheme="teal" variant="outline" type="submit">
              Submit
            </Button>
          </GridItem>
        </Grid>
      </form>
      <Box overflowX="auto">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Action</Th>
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
                    size="lg"
                    colorScheme="telegram"
                  >
                    {user.name}
                  </Checkbox>
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
    </Container>
  );
};

export default UserTable;
