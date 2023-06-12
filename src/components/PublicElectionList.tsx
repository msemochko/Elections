import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { FlexboxGrid } from 'rsuite';
import Loading from '../pages/Loading';
import {
  Election,
  getPublicElectionList,
} from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';
import NewElectionButton from './NewElectionButton';

interface PELProps {
  filterDomain?: boolean;
}

const PublicElectionList: FC<PELProps> = ({ filterDomain = false }) => {
  const ctx = useContext(Credentials);
  const user = useContext(User);
  // const [electionList, setElectionList] = useState<Array<Election>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [t] = useTranslation();
    // @ts-ignore
    const electionList : Array<Election> = [
        // @ts-ignore
     {created: "2023-04-30T14:00:00Z", enable_multiple_submissions: false, public: true,id:"6017de03-26a7-4647-b89a-ca079e76b43c",title:"ferrgerg",subtitle:"gergrgerg",description:"gregrgergergergergerg",election_email_domain:"gmail.com",  public:false, submission_start_time:"2023-04-23T06:00:00Z",submission_end_time:"2023-04-30T14:00:00Z",submission_release_time:"2023-05-03T14:00:00Z",voting_start_time:"2023-05-07T06:00:00Z",voting_end_time:"2023-05-14T14:00:00Z",voting_release_time:"2023-05-14T14:00:00Z",manager:"4a330c11-5d4c-47dd-bc90-0d53f8403923"},
        // @ts-ignore
        {id:"4c244d4f-5d18-4155-8832-1ee850380762",title:"Elections",subtitle:"elections",description:"jnjvhbvhfbvdhfbvhdbvdhfbv",election_email_domain:"uottawa.ca", public:false,submission_start_time:"2023-04-23T06:00:00Z",submission_end_time:"2023-04-30T14:00:00Z",submission_release_time:"2023-05-03T14:00:00Z",voting_start_time:"2023-05-07T06:00:00Z",voting_end_time:"2023-05-14T14:00:00Z",voting_release_time:"2023-05-16T14:00:00Z",manager:"4a330c11-5d4c-47dd-bc90-0d53f8403923"},
        // @ts-ignore
     {"id":"71383aee-6d57-4974-b01a-46e940e568e6","title":"IEEE Elections 2023 / Élections de l'IEEE 2023","subtitle":"Join IEEE uOttawa! / Rejoignez IEEE uOttawa!","description":"Thank you for your interest in joining the IEEE uOttawa Student Branch! The executive committee has been growing throughout the school year and is looking forward to seeing new and returning faces for the 2023-2024 school year.\n\nBefore submitting your application, you must email elections@ieeeuottawa.ca with your full name, student number, program, and year of study.\n\nYou must be a registered uOttawa student at the Faculty of Engineering or Faculty of Science with a CGPA of 4.5 or above to apply for a position with IEEE uOttawa.\n\nPlease note that the nomination period ends on March 26th at 12 PM.\n\nElection timeline:\nMarch 13, 12 PM to March 26, 12 PM: Nomination period\nMarch 26, 12 PM (NOON): Mandatory candidates meeting (mark your calendar!)\nMarch 27, 12 AM to April 1, 11:59 PM: Campaigning period\nApril 2, 12 AM to April 3, 12 PM: Voting period ends\n\nYou can view all the positions that are available below along with their mandate. \nYou must have at least one year of executive experience with IEEE uOttawa to apply for the Chair and Vice-Chair positions.\n---\n\nMerci de votre intention de rejoindre IEEE uOttawa Branche Étudiante ! Le comité exécutif s’est agrandi tout au long de l’année scolaire et impatient de voir de nouveaux et d’anciens visages pour l’année scolaire 2023-2024.\n \nAvant de soumettre votre candidature, vous devez envoyer un courriel à elections@ieeeuottawa.ca avec votre nom complet, numéro d’étudiant, programme d’études et votre année d’études.\n \nVous devez être un étudiant d’uOttawa inscrit à la faculté de génie ou à la faculté de sciences avec un MPT de 4.5 ou plus pour pouvoir faire une candidature à un poste au sein de IEEE uOttawa.\n \nVeuillez noter que la période de nomination prend fin le 26 mars à 12 : 00 :\nCalendrier des élections :\n13 mars, 12 : 00 au 26 mars, 12 :00 : Période de nomination\n26 mars, 12 : 00 : Rencontre obligatoire des candidats (A noter dans votre calendrier !)\n27 mars, 12 : 00 au 1er avril, 23 :59 : Période de campagne\n2 avril, 00 : 00 au 3 avril, 12 :00 : Période des votes\n \nVous pouvez consulter tous les postes disponibles ci-dessous ainsi que leurs mandats :\nVous devez avoir au moins une année d’expérience en tant qu’exécutif à IEEE uOttawa pour pouvoir postuler aux positions de Président et de Vice-Président.","election_email_domain":"uottawa.ca","public":false,"submission_start_time":"2023-03-13T16:00:00Z","submission_end_time":"2023-03-26T16:00:00Z","submission_release_time":"2023-03-26T17:30:00Z","voting_start_time":"2023-04-02T04:00:00Z","voting_end_time":"2023-04-04T16:00:00Z","voting_release_time":"2023-04-05T16:00:00Z","manager":"226dea2c-47c3-4edb-859d-92dd5472260d"}
 ]

    // const electionList: Array<Election> = []
//     const userDomain = useMemo(() => {
//     if (!user || !user.user || !user.user.email) return '';
//     const domain = user.user.email.split('@');
//     if (domain.length === 2) return domain[1];
//     return '';
//   }, [user]);

  useEffect(() => {
    // Return if the list has already been populated.
    if (
      !ctx ||
      electionList.length ||
      !loading ||
      !ctx.credentials ||
      !ctx.credentials.authenticated
    )
      return;
    // If logged in, attempt to get the list of elections.
    getPublicElectionList()
      .then((res) => {
        const elections: Election[] = res.data;

        // return setElectionList(
        //   filterDomain
        //     ? elections.filter((e) => e.election_email_domain === userDomain)
        //     : elections
        // );
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ctx]);

  // if (loading || !electionList || !user || !user.user || !user.user.email)
  //   return <Loading half />;

  if (electionList.length === 0)
    return (
      <Fragment>
        <br />
        <FlexboxGrid align="middle" justify="center">
          <FlexboxGrid.Item>
            <p>{t('electionList.noMatchingElections')}</p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <br />
        <FlexboxGrid align="middle" justify="center">
          <FlexboxGrid.Item>
            <NewElectionButton />
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <br />
      </Fragment>
    );

  return (
    <div>
      <Fade cascade duration={250} triggerOnce delay={0} damping={0.1}>
        {electionList.map((election, index) => (
          <ElectionListElement key={index} index={index} election={election} />
        ))}
      </Fade>
      <br />
    </div>
  );
};

export default PublicElectionList;
