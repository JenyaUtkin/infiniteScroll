import React, { memo } from 'react'
import styles from './UserCard.module.scss'

interface UserCardProps {
    name: string
    phone: string
    email: string
    picture: string
}

/**
 React component that renders a user card with name, phone, email, and picture.
 @param {Object} props - Component props.
 @param {string} props.name - User name.
 @param {string} props.phone - User phone.
 @param {string} props.email - User email.
 @param {string} props.picture - User picture URL.
 @returns {JSX.Element} - Rendered component.
 */
const UserCard = ({ name, phone, email, picture }: UserCardProps): JSX.Element => {
    return (
        <div className={styles.userCard}>
            <div className={styles.image}>
                <img src={picture} alt={`${name}'s profile`}/>
            </div>
            <div className={styles.info}>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.phone}>{phone}</p>
                <p className={styles.email}>{email}</p>
            </div>
        </div>
    )
}

export default memo(UserCard)
