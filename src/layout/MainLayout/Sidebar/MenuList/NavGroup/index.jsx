// NavGroup.jsx
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

const NavGroup = ({ item }) => {
  const theme = useTheme();
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const renderNavItems = (menuItems, isCollapsed = false) => {
    return menuItems.map((menu) => {
      if (menu.type === 'item' && menu.url) {
        return <NavItem key={menu.id} item={menu} level={1} isCollapsed={isCollapsed} />;
      } else if (menu.type === 'collapse') {
        return leftDrawerOpened ? (
          <NavCollapse key={menu.id} menu={menu} level={1} keepOpen={true} />
        ) : (
          renderNavItems(menu.children, true)
        );
      }
      return null;
    }).filter(Boolean);
  };
  
  const items = renderNavItems(item.children || []);

  return (
    <List
      subheader={
        leftDrawerOpened && item.title && (
          <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
            {item.title}
            {item.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                {item.caption}
              </Typography>
            )}
          </Typography>
        )
      }
    >
      {items}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;