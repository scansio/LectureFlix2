import Reblend, { useState, useEffect, SharedConfig, IAny } from "reblendjs";
import { Col, Form, Image, InputGroup, Row, Spinner } from "react-bootstrap";
import { redirectTo } from "reblend-router";
import fetcher from "../../scripts/SharedFetcher";
import { toast } from "react-toastify";
import { BASE, USER_BASE } from "../../scripts/config/RestEndpoints";
import { authTokenContext } from "../../context";

function Profile() {
  const profileData: {
    email: string;
    slug: string;
    firstname: string;
    lastname: string;
    bio: string;
    phone: string;
    avatar: string;
    _id: string;
  } | null =
    SharedConfig.getLocalData("user") ||
    (authTokenContext.reset(), redirectTo("/login"), null);

  const [submitting, setSubmitting] = useState(false);

  const [slug, setslug] = useState(profileData?.slug);
  const [email] = useState(profileData?.email);
  const [firstname, setfirstname] = useState(profileData?.firstname);
  const [lastname, setlastname] = useState(profileData?.lastname);
  const [bio, setbio] = useState(profileData?.bio);
  const [phone, setphone] = useState(profileData?.phone);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState(profileData?.avatar);
  const [urlChanged, seturlChanged] = useState(false);

  useEffect(() => {
    if (profileImage) {
      let url = URL.createObjectURL(profileImage);
      setProfileImageUrl(url);
      seturlChanged(true);
    }
    return () => {
      if (profileImageUrl?.startsWith("data:")) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
    // eslint-disable-next-line reblend-hooks/exhaustive-deps
  }, [profileImage]);

  async function updateProfile(e: any) {
    e.preventDefault();
    if (!bio || bio?.length > 500) {
      toast.error("Your bio should be less than 500 characters");
      return;
    }
    setSubmitting(true);

    let fetchOptiondata: IAny | FormData = {};
    if (profileImage) {
      fetchOptiondata = new FormData();
      fetchOptiondata.append("avatar", profileImage);
      fetchOptiondata.append("slug", slug);
      fetchOptiondata.append("email", email);
      fetchOptiondata.append("firstname", firstname);
      fetchOptiondata.append("lastname", lastname);
      fetchOptiondata.append("bio", bio);
      fetchOptiondata.append("phone", phone);
    } else {
      fetchOptiondata = {
        slug,
        email,
        firstname,
        lastname,
        bio,
        phone,
      };
    }

    const gdFetchOption = {
      url: USER_BASE,
      method: "PATCH",
      data: fetchOptiondata,
    };
    profileImage &&
      ((gdFetchOption as any).headers = {
        "Content-Type": "multipart/form-data",
      });
    let data;
    try {
      data = await fetcher.fetch(gdFetchOption);
    } catch (er: any) {
      toast.error(er.message);
    }
    if (data) {
      if (!data?.connection?.status) {
        toast.error(data?.connection?.message);
      } else {
        const userInfo = { ...profileData, ...(data.data.userInfo || {}) };
        SharedConfig.setLocalData("user", userInfo);
        toast.success(data?.connection?.message);
      }
    }
    setSubmitting(false);
  }

  return (
    <>
      <Form onSubmit={(e) => updateProfile(e)}>
        <Row>
          <Col xs={12} md={5} lg={5}>
            <Row>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Profile image</InputGroup>

                <InputGroup className="fw-bold">
                  {profileImageUrl ? (
                    <Image
                      src={
                        urlChanged ? profileImageUrl : BASE + profileImageUrl
                      }
                    />
                  ) : null}
                </InputGroup>
                <Form.Control
                  type="file"
                  onChange={(e: any) => {
                    setProfileImage(e.target.files[0] as any as File);
                  }}
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">First Name</InputGroup>
                <Form.Control
                  required={true}
                  type="text"
                  value={firstname}
                  onChange={(e) => setfirstname(e.target.value)}
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Last Name</InputGroup>
                <Form.Control
                  required={true}
                  type="text"
                  value={lastname}
                  onChange={(e) => setlastname(e.target.value)}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={7} lg={7}>
            <Row>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup>
                  <InputGroup.Text className="fw-bold">Email</InputGroup.Text>
                  <Form.Control readOnly type="text" value={email} />
                </InputGroup>
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Slug</InputGroup>
                <Form.Control
                  required={true}
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setslug(
                      e.target.value
                        ?.trim()
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                        .replace(/-+$/, "")
                    )
                  }
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Phone</InputGroup>
                <Form.Control
                  required={true}
                  type="tel"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                />
              </Col>
              <Col xs="12" className="p-1 pt-2">
                <InputGroup className="fw-bold">Bio</InputGroup>
                <InputGroup className="fw-bold">
                  <textarea
                    className="form-control"
                    required={true}
                    value={bio}
                    onChange={(e) => setbio(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <InputGroup style={{ margin: "2px" }}>
          {submitting ? (
            <Spinner />
          ) : (
            <Form.Control
              size="sm"
              type="submit"
              style={{ margin: "2px" }}
              value={"Update"}
              className="fw-bold utilityLink"
            />
          )}
        </InputGroup>
      </Form>
    </>
  );
}
export default Profile;
