import styles from './UserCard.module.scss';

interface Props {
    name: string;
    phone: string;
    email: string;
    picture: string;
}

const UserCard = ({ name, phone, email, picture }: Props) => {
    return (
        <div className={styles.userCard}>
            <div className={styles.image}>
                <img src={picture} alt={`${name}'s profile`} />
            </div>
            <div className={styles.info}>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.phone}>{phone}</p>
                <p className={styles.email}>{email}</p>
            </div>
        </div>
    );
};

export default UserCard;
