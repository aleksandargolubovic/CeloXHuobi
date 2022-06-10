import { motion } from 'framer-motion';
import WidgetTeamMembers from '../widgets/WidgetTeamMembers';

function TeamMembersTab() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="widget flex w-full p-12">
        <WidgetTeamMembers/>
      </motion.div>
    </motion.div>
  );
}

export default TeamMembersTab;
